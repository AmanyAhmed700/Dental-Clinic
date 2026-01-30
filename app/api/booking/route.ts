import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
  return decoded;
}

// GET — عرض المواعيد
export async function GET(req: Request) {
  try {
    const user = authenticate(req);
    const { searchParams } = new URL(req.url);
    const doctorIdParam = searchParams.get("doctorId");

    let appointments;

    if (user.role === "DOCTOR") {
      appointments = await prisma.appointment.findMany({
        where: { doctorId: user.userId },
        include: { doctor: { select: { name: true } }, patient: { select: { name: true } } },
        orderBy: { date: "asc" },
      });
    } else {
      let doctorId = doctorIdParam ? Number(doctorIdParam) : null;

      if (!doctorId) {
        const doctorWithAvailable = await prisma.appointment.findFirst({
          where: { status: "AVAILABLE" },
          select: { doctorId: true },
        });

        if (!doctorWithAvailable) {
          return NextResponse.json({
            success: true,
            appointments: [],
            message: "لا توجد مواعيد متاحة حاليًا",
          });
        }

        doctorId = doctorWithAvailable.doctorId;
      }

      appointments = await prisma.appointment.findMany({
        where: { doctorId, status: "AVAILABLE" },
        include: { doctor: { select: { name: true } } },
        orderBy: { date: "asc" },
      });
    }

    return NextResponse.json({ success: true, appointments });
  } catch (err: any) {
    console.error("GET error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}

//  PATCH — حجز موعد من المريض
export async function PATCH(req: Request) {
  try {
    const user = authenticate(req);
    if (user.role !== "PATIENT") throw new Error("غير مصرح");

    const body = await req.json();
    const { appointmentId, fullName, phone } = body;

    if (!appointmentId || !fullName || !phone)
      throw new Error("البيانات غير مكتملة");

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        patientId: user.userId,
        patientName: fullName,
        patientPhone: phone,
        status: "PENDING",
      },
    });

    //  إرسال إشعارات للطبيب والمريض
    const doctor = await prisma.user.findUnique({ where: { id: appointment.doctorId } });
    const patient = await prisma.user.findUnique({ where: { id: user.userId } });

    if (doctor) {
      await prisma.notification.create({
        data: {
          userId: doctor.id,
          title: "تم حجز موعد جديد",
          message: `قام المريض ${fullName} بحجز موعد بتاريخ ${appointment.date} الساعة ${appointment.time}`,
          type: "booking",
        },
      });
    }

 

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    console.error("PATCH error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}

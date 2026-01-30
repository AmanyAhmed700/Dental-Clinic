import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

//  Verify user token
function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
}

//  GET - Fetch appointments
export async function GET(req: Request) {
  try {
    const user = authenticate(req);

    let appointments;
    if (user.role === "DOCTOR") {
      // Doctor sees only their own appointments
      appointments = await prisma.appointment.findMany({
        where: { doctorId: user.userId },
        include: {
          patient: { select: { name: true } },
        },
        orderBy: { date: "asc" },
      });
    } else {
      // Patient sees only available ones
      appointments = await prisma.appointment.findMany({
        where: { status: "AVAILABLE" },
        orderBy: { date: "asc" },
      });
    }

    return NextResponse.json({ success: true, appointments });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: err.message || "Error loading appointments",
    });
  }
}

//  POST - Create a new appointment slot
export async function POST(req: Request) {
  try {
    const user = authenticate(req);
    if (user.role !== "DOCTOR") throw new Error("Unauthorized");

    const body = await req.json();
    const { date, time } = body;
    if (!date || !time) throw new Error("Missing required data");

    //  Convert doctor’s local date to UTC to store consistently
    const selected = new Date(date);
    const correctedUTC = new Date(
      Date.UTC(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
        0,
        0,
        0
      )
    );

    const slot = await prisma.appointment.create({
      data: {
        doctorId: user.userId,
        date: correctedUTC,
        time,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (err: any) {
    console.error("POST /api/appointments error:", err);
    return NextResponse.json({
      success: false,
      message: err.message || "Error creating appointment",
    });
  }
}

//  PATCH - Update appointment status (Accept / Reject)


// DELETE - Delete single or all doctor’s appointments
export async function DELETE(req: Request) {
  try {
    const user = authenticate(req);
    if (user.role !== "DOCTOR") throw new Error("Unauthorized");

    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");

    if (appointmentId) {
      // Delete a single appointment
      await prisma.appointment.delete({
        where: { id: Number(appointmentId), doctorId: user.userId },
      });
      return NextResponse.json({
        success: true,
        message: "Appointment deleted",
      });
    } else {
      // Delete all appointments of the doctor
      await prisma.appointment.deleteMany({
        where: { doctorId: user.userId },
      });
      return NextResponse.json({
        success: true,
        message: "All appointments deleted",
      });
    }
  } catch (err: any) {
    console.error("DELETE /api/appointments error:", err);
    return NextResponse.json({
      success: false,
      message: err.message || "Error deleting appointments",
    });
  }
}

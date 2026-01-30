// app/api/notifications/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
}

//  GET - Fetch all notifications
export async function GET(req: Request) {
  try {
    const user = authenticate(req);
    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        title: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
        appointmentId: true,
      },
    });
    return NextResponse.json({ success: true, notifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}

//  PATCH - Update appointment status (Accept / Reject)
export async function PATCH(req: Request) {
  try {
    const user = authenticate(req);
    if (user.role !== "DOCTOR") throw new Error("Only doctors can perform this action");

    const { appointmentId, status } = await req.json();
    if (!appointmentId || !["ACCEPTED", "REJECTED"].includes(status))
      throw new Error("Invalid data");

    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status },
      include: { patient: true },
    });

    if (appointment.patientId) {
      const dateStr = new Date(appointment.date).toLocaleDateString("en-US");
      const timeStr = appointment.time;

      const title =
        status === "ACCEPTED"
          ? "Your appointment has been confirmed "
          : "Your appointment has been rejected ";

      const message =
        status === "ACCEPTED"
          ? `Your appointment on ${dateStr} at ${timeStr} has been confirmed.`
          : `Sorry, your appointment on ${dateStr} at ${timeStr} has been rejected. Please choose another time.`;

      await prisma.notification.upsert({
        where: {
          userId_appointmentId_type: {
            userId: appointment.patientId,
            appointmentId: appointment.id,
            type: "APPOINTMENT",
          },
        },
        update: { title, message, isRead: false },
        create: {
          userId: appointment.patientId,
          appointmentId: appointment.id,
          title,
          message,
          type: "APPOINTMENT",
          isRead: false,
        },
      });

      //  إضافة userId في الإشعار
      if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
        localStorage.setItem('notification_update', Date.now().toString());
        localStorage.setItem('notification_user_id', appointment.patientId.toString());
      }
    }

    return NextResponse.json({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (err: any) {
    console.error("PATCH /api/notifications error:", err);
    return NextResponse.json({
      success: false,
      message: err.message || "Error updating appointment",
    });
  }
}
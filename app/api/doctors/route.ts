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

export async function GET(req: Request) {
  try {
    authenticate(req);

    const doctors = await prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: { id: true, name: true },
    });

    return NextResponse.json({ success: true, doctors });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ غير معروف";
    return NextResponse.json({ success: false, message });
  }
}

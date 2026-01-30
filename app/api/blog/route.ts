import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

//  التحقق من التوكن
function authenticate(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("Unauthorized");
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
}

// -------------------- GET جميع المقالات --------------------
export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: { author: { select: { name: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, blogs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ غير معروف";
    return NextResponse.json({ success: false, message });
  }
}

// -------------------- POST إنشاء مقال جديد --------------------
export async function POST(req: Request) {
  try {
    const user = authenticate(req);
    if (user.role !== "ADMIN" && user.role !== "DOCTOR") {
      throw new Error("غير مصرح لك بإنشاء مقال");
    }

    const data = await req.formData();
    const title = data.get("title") as string;
    const content = data.get("content") as string;
    const imageFile = data.get("image") as File | null;

    if (!title || !content) throw new Error("العنوان والمحتوى مطلوبان");

    let imageUrl: string | null = null;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const upload = await cloudinary.uploader.upload(
        "data:image/jpeg;base64," + buffer.toString("base64"),
        { folder: "blogs" }
      );
      imageUrl = upload.secure_url;
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        image: imageUrl,
        authorId: user.userId,
      },
    });

    //  إرسال إشعار لكل المرضى بوجود مقال جديد
    const patients = await prisma.user.findMany({ where: { role: "PATIENT" } });

    const notifications = patients.map((p) =>
      prisma.notification.create({
        data: {
          userId: p.id,
          title: " مقال جديد على المدونة",
          message: `تم نشر مقال جديد بعنوان "${title}"`,
          type: "blog",
        },
      })
    );

    await Promise.all(notifications);

    return NextResponse.json({ success: true, blog });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "حدث خطأ غير معروف";
    console.error("POST /api/blog error:", message);
    return NextResponse.json({ success: false, message });
  }
}

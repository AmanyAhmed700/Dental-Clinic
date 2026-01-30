import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question || question.trim() === "") {
      return NextResponse.json(
        { success: false, message: "يرجى كتابة سؤال صحيح." },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, message: "مفتاح API غير موجود في .env" },
        { status: 500 }
      );
    }

   
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `. أجب بإيجاز ووضوح على السؤال التالي: ${question}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await res.json();

    console.log("🔍 Gemini Raw Response:", JSON.stringify(data, null, 2));

    if (!res.ok || !data?.candidates?.length) {
      return NextResponse.json(
        {
          success: false,
          message: data.error?.message || "⚠️ لم يتم العثور على إجابة.",
        },
        { status: 500 }
      );
    }

    const answer = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ success: true, answer });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("user")
      .select("*");

    console.log("Error:", error);
    console.log("Data:", data);

    if (error) throw error;

    return NextResponse.json({ success: true, users: data || [] });
  } catch (err: unknown) {
    return NextResponse.json({
      success: false,
      error: (err as Error).message || "Failed to fetch users",
    });
  }
}

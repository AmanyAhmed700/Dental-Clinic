import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import prisma from "./prisma";

export async function getUserFromSession() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: cookieStore }
  );

  const { data } = await supabase.auth.getUser();
  if (!data?.user) return null;

  const user = await prisma.user.findUnique({
    where: { email: data.user.email! },
  });

  return user;
}

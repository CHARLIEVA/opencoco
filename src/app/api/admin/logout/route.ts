import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const data = await request.formData();
  const locale = String(data.get("locale") ?? "zh");
  await clearAdminCookie();
  return NextResponse.redirect(new URL(`/${locale}`, request.url));
}

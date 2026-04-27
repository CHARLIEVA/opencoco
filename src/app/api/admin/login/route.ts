import { NextResponse } from "next/server";
import {
  createAdminCookieValue,
  setAdminCookie,
  validateAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const data = await request.formData();
  const username = String(data.get("username") ?? "");
  const password = String(data.get("password") ?? "");
  const locale = String(data.get("locale") ?? "zh");

  if (!validateAdminCredentials(username, password)) {
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
  }

  await setAdminCookie(createAdminCookieValue(username));
  return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
}

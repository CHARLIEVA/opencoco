import { NextResponse } from "next/server";
import {
  createSupabaseRouteClient,
  hasSupabaseBrowserEnv,
} from "@/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/zh/favorites";

  if (!hasSupabaseBrowserEnv || !code) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  const supabase = await createSupabaseRouteClient();
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(new URL(next, request.url));
}

import { NextResponse } from "next/server";
import { listCases } from "@/lib/case-store";
import {
  createSupabaseServiceRoleClient,
  hasSupabaseServerEnv,
} from "@/lib/supabase-server";

const getToken = (request: Request) => {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.replace("Bearer ", "");
};

const getUserIdFromToken = async (request: Request) => {
  const token = getToken(request);
  if (!token || !hasSupabaseServerEnv) {
    return null;
  }

  const client = createSupabaseServiceRoleClient();
  const { data, error } = await client.auth.getUser(token);
  if (error) {
    return null;
  }

  return data.user.id;
};

export async function GET(request: Request) {
  if (!hasSupabaseServerEnv) {
    return NextResponse.json({ ids: [], cases: [] });
  }

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ ids: [], cases: [] }, { status: 401 });
  }

  const client = createSupabaseServiceRoleClient();
  const { data, error } = await client
    .from("favorites")
    .select("case_id")
    .eq("user_id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const ids = (data ?? []).map((item) => String(item.case_id));
  const allCases = await listCases();
  const cases = allCases.filter((item) => ids.includes(item.id));
  return NextResponse.json({ ids, cases });
}

export async function POST(request: Request) {
  if (!hasSupabaseServerEnv) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 400 });
  }

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseId } = (await request.json()) as { caseId: string };
  const client = createSupabaseServiceRoleClient();
  const { error } = await client.from("favorites").upsert({
    user_id: userId,
    case_id: caseId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!hasSupabaseServerEnv) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 400 });
  }

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caseId } = (await request.json()) as { caseId: string };
  const client = createSupabaseServiceRoleClient();
  const { error } = await client
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("case_id", caseId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

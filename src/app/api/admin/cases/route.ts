import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { upsertCase } from "@/lib/case-store";
import { AdminCaseInput } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = (await request.json()) as AdminCaseInput;
  const item = await upsertCase(input);
  return NextResponse.json({ item });
}

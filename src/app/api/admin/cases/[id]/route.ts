import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { removeCase } from "@/lib/case-store";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: RouteProps) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await removeCase(id);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import getDb from "@/lib/db";

const VALID_STATUSES = ["pending", "paid", "shipped"];

export async function POST(request) {
  const { id, status } = await request.json();

  if (!id || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid id or status" }, { status: 400 });
  }

  const db = getDb();
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  return NextResponse.json({ success: true });
}

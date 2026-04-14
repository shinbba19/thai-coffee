import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export function GET() {
  const db = getDb();
  const products = db.prepare("SELECT * FROM products").all();
  return NextResponse.json(products);
}

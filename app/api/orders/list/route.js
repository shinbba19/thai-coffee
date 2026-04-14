import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export function GET() {
  const db = getDb();

  const orders = db
    .prepare(
      `SELECT o.*, GROUP_CONCAT(p.name || ' x' || oi.quantity, ', ') as items_summary
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       GROUP BY o.id
       ORDER BY o.created_at DESC`
    )
    .all();

  return NextResponse.json(orders);
}

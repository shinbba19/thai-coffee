import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function POST(request) {
  const { wallet_address, total_eth, tx_hash, items } = await request.json();

  if (!wallet_address || !total_eth || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = getDb();

  const insertOrder = db.prepare(
    "INSERT INTO orders (wallet_address, total_eth, tx_hash, status, created_at) VALUES (?, ?, ?, 'pending', ?)"
  );
  const insertItem = db.prepare(
    "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)"
  );

  const createOrder = db.transaction(() => {
    const { lastInsertRowid } = insertOrder.run(
      wallet_address,
      total_eth,
      tx_hash,
      new Date().toISOString()
    );
    for (const item of items) {
      insertItem.run(lastInsertRowid, item.product_id, item.quantity);
    }
    return lastInsertRowid;
  });

  const orderId = createOrder();
  return NextResponse.json({ orderId }, { status: 201 });
}

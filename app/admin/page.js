"use client";

import { useEffect, useState } from "react";

const STATUS_OPTIONS = ["pending", "paid", "shipped"];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-blue-100 text-blue-700",
};

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    const res = await fetch("/api/orders/list");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id, status) {
    await fetch("/api/orders/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage incoming orders and payment status.</p>

      {loading ? (
        <p className="text-gray-400">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 text-sm">
            <thead>
              <tr className="text-left text-gray-400 uppercase text-xs border-b border-gray-100">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Wallet</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Tx Hash</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-500">#{order.id}</td>
                  <td className="px-4 py-3 font-mono text-gray-600 text-xs">
                    {order.wallet_address.slice(0, 8)}…{order.wallet_address.slice(-4)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                    {order.items_summary || "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-700">
                    {order.total_eth} MTHB1
                  </td>
                  <td className="px-4 py-3">
                    {order.tx_hash ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${order.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-600 hover:underline font-mono text-xs"
                      >
                        {order.tx_hash.slice(0, 10)}…
                      </a>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

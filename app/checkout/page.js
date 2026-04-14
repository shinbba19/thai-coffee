"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { useCart } from "@/components/CartProvider";
import WalletButton from "@/components/WalletButton";
import Link from "next/link";

const MERCHANT_WALLET = "0x79e7f2Dd3d28C72E8b9234b427EE99B25adD82f6";
const MTHB1_ADDRESS = "0xfD20C018703973f85698a58d36e901fa26A799dF";
const MTHB1_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
];

export default function CheckoutPage() {
  const { cart, total, dispatch } = useCart();
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState(null);
  const [mthbBalance, setMthbBalance] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | paying | error
  const [errorMsg, setErrorMsg] = useState("");

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-xl mb-4">No items to checkout.</p>
        <Link href="/" className="text-amber-600 hover:underline font-semibold">
          Browse the menu →
        </Link>
      </div>
    );
  }

  async function handleWalletConnected(address) {
    setWalletAddress(address);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(MTHB1_ADDRESS, MTHB1_ABI, provider);
      const raw = await contract.balanceOf(address);
      setMthbBalance(parseFloat(ethers.formatUnits(raw, 18)).toFixed(2));
    } catch {
      setMthbBalance("—");
    }
  }

  async function handlePay() {
    if (!walletAddress) {
      setErrorMsg("Please connect your wallet first.");
      return;
    }
    setStatus("paying");
    setErrorMsg("");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MTHB1_ADDRESS, MTHB1_ABI, signer);

      const amount = ethers.parseUnits(total.toFixed(2), 18);
      const tx = await contract.transfer(MERCHANT_WALLET, amount);
      await tx.wait();

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: walletAddress,
          total_eth: total,
          tx_hash: tx.hash,
          items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        }),
      });

      const data = await res.json();
      dispatch({ type: "CLEAR_CART" });
      router.push(`/success?orderId=${data.orderId}&txHash=${tx.hash}`);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Transaction failed.");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-gray-600">
              <span>{item.name} × {item.quantity}</span>
              <span>{(item.price_eth * item.quantity).toFixed(2)} MTHB1</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span className="text-amber-700">{total.toFixed(2)} MTHB1</span>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4">Payment Wallet</h2>
        <WalletButton onConnected={handleWalletConnected} />
        {mthbBalance !== null && (
          <p className="text-sm text-gray-500 mt-3">
            MTHB1 Balance:{" "}
            <span className={parseFloat(mthbBalance) < total ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
              {mthbBalance} MTHB1
            </span>
            {parseFloat(mthbBalance) < total && (
              <span className="ml-2 text-red-400 text-xs">⚠ Insufficient balance</span>
            )}
          </p>
        )}
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePay}
        disabled={status === "paying" || (mthbBalance !== null && parseFloat(mthbBalance) < total)}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
      >
        {status === "paying" && (
          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {status === "paying" ? "Processing…" : `Pay ${total.toFixed(2)} MTHB1`}
      </button>

      {errorMsg && (
        <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        Sepolia testnet only · MTHB1 sent to merchant wallet · No refunds (prototype)
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";

const SEPOLIA_CHAIN_ID = "0xaa36a7";

export default function WalletButton({ onConnected }) {
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | connecting | switching | error
  const [error, setError] = useState(null);

  async function connect() {
    setError(null);

    if (!window.ethereum || !window.ethereum.isMetaMask) {
      setError("MetaMask not detected. Please install the MetaMask extension.");
      return;
    }

    try {
      setStatus("connecting");
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== SEPOLIA_CHAIN_ID) {
        setStatus("switching");
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
        } catch {
          setStatus("error");
          setError("Please switch MetaMask to the Sepolia testnet and try again.");
          return;
        }
      }

      setAddress(accounts[0]);
      setStatus("idle");
      onConnected?.(accounts[0]);
    } catch (err) {
      setStatus("error");
      if (err.code === 4001) {
        setError("Connection rejected. Please approve the request in MetaMask.");
      } else {
        setError(err.message);
      }
    }
  }

  if (address) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
        <span className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-sm text-green-700 font-mono">
          {address.slice(0, 6)}…{address.slice(-4)}
        </span>
      </div>
    );
  }

  const isConnecting = status === "connecting" || status === "switching";

  return (
    <div>
      <button
        onClick={connect}
        disabled={isConnecting}
        className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        {isConnecting && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {status === "connecting" && "Check MetaMask…"}
        {status === "switching" && "Switch Network…"}
        {(status === "idle" || status === "error") && "Connect Wallet"}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {status === "connecting" && (
        <p className="text-amber-600 text-xs mt-2">
          👆 Look for the approval prompt in your MetaMask panel
        </p>
      )}
    </div>
  );
}

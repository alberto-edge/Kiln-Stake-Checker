"use client";

import { useState } from "react";
import type { Chain } from "@/lib/types";

interface SearchBarProps {
  onSearch: (wallet: string, chain: Chain) => void;
  loading: boolean;
}

function detectChain(address: string): Chain | null {
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) return "eth";
  if (/^addr1[a-z0-9]{50,120}$/.test(address)) return "ada";
  if (/^stake1[a-z0-9]{50,60}$/.test(address)) return "ada";
  return null;
}

const chainLabels: Record<Chain, { name: string; symbol: string }> = {
  eth: { name: "Ethereum", symbol: "ETH" },
  ada: { name: "Cardano", symbol: "ADA" },
};

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [address, setAddress] = useState("");

  const detectedChain = address.length > 2 ? detectChain(address) : null;
  const isValid = detectedChain !== null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid && detectedChain) {
      onSearch(address, detectedChain);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <label className="block text-sm font-medium text-muted mb-2">
        Wallet Address
      </label>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value.trim())}
            placeholder="0x... (ETH) or addr1... (ADA)"
            className="w-full rounded-lg bg-card border border-card-border px-4 py-3 text-foreground font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          {detectedChain && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-accent bg-accent/10 rounded-full px-2.5 py-0.5">
              {chainLabels[detectedChain].symbol}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!isValid || loading}
          className="rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading
            </span>
          ) : (
            "Search"
          )}
        </button>
      </div>
      {address.length > 3 && !isValid && (
        <p className="mt-2 text-sm text-danger">
          Enter a valid Ethereum address (0x...) or Cardano address (addr1... / stake1...)
        </p>
      )}
    </form>
  );
}

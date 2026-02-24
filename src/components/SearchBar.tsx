"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (wallet: string) => void;
  loading: boolean;
}

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [address, setAddress] = useState("");

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValidAddress) {
      onSearch(address);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <label className="block text-sm font-medium text-muted mb-2">
        Ethereum Wallet Address
      </label>
      <div className="flex gap-3">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="flex-1 rounded-lg bg-card border border-card-border px-4 py-3 text-foreground font-mono text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!isValidAddress || loading}
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
      {address && !isValidAddress && (
        <p className="mt-2 text-sm text-danger">
          Enter a valid Ethereum address (0x followed by 40 hex characters)
        </p>
      )}
    </form>
  );
}

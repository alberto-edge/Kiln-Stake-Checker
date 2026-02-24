"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import StakesSummary from "@/components/StakesSummary";
import RewardsTable from "@/components/RewardsTable";
import OperationsTable from "@/components/OperationsTable";
import ExitTickets from "@/components/ExitTickets";
import NetworkStats from "@/components/NetworkStats";
import StatusSummary from "@/components/StatusSummary";
import type { Stake, Reward, Operation, ExitTicket, NetworkStats as NetworkStatsType } from "@/lib/types";

interface ReportData {
  stakes: Stake[];
  rewards: Reward[];
  operations: Operation[];
  exitTickets: ExitTicket[];
  networkStats: NetworkStatsType | null;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [data, setData] = useState<ReportData | null>(null);

  async function fetchReport(walletAddress: string) {
    setLoading(true);
    setError(null);
    setWallet(walletAddress);
    setData(null);

    try {
      const params = `wallets=${walletAddress}`;

      const [stakesRes, rewardsRes, operationsRes, exitTicketsRes] = await Promise.all([
        fetch(`/api/stakes?${params}`),
        fetch(`/api/rewards?${params}`),
        fetch(`/api/operations?${params}`),
        fetch(`/api/exit-tickets?${params}`),
      ]);

      const [stakesJson, rewardsJson, operationsJson, exitTicketsJson] = await Promise.all([
        stakesRes.json(),
        rewardsRes.json(),
        operationsRes.json(),
        exitTicketsRes.json(),
      ]);

      if (!stakesRes.ok) throw new Error(stakesJson.error || `Stakes API error: ${stakesRes.status}`);
      if (!rewardsRes.ok) throw new Error(rewardsJson.error || `Rewards API error: ${rewardsRes.status}`);
      if (!operationsRes.ok) throw new Error(operationsJson.error || `Operations API error: ${operationsRes.status}`);
      if (!exitTicketsRes.ok) throw new Error(exitTicketsJson.error || `Exit tickets API error: ${exitTicketsRes.status}`);

      let networkStats: NetworkStatsType | null = null;
      const stakes: Stake[] = stakesJson.data || [];
      if (stakes.length > 0 && stakes[0].integration_address) {
        try {
          const nsRes = await fetch(`/api/network-stats?integration=${stakes[0].integration_address}`);
          if (nsRes.ok) {
            const nsJson = await nsRes.json();
            networkStats = nsJson.data || null;
          }
        } catch {
          // network stats are optional
        }
      }

      setData({
        stakes,
        rewards: rewardsJson.data || [],
        operations: operationsJson.data || [],
        exitTickets: exitTicketsJson.data || [],
        networkStats,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Kiln Stake Checker ⟠🥩✅</h1>
          </div>
          <p className="text-sm text-muted">Look up ETH staking positions, rewards, and operations by wallet address</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <SearchBar onSearch={fetchReport} loading={loading} />

        {error && (
          <div className="rounded-xl bg-danger/10 border border-danger/30 p-4 text-danger text-sm">
            <p className="font-semibold mb-1">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <svg className="animate-spin h-8 w-8 mx-auto text-accent mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-muted text-sm">Fetching staking data from Kiln...</p>
          </div>
        )}

        {data && !loading && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted">
              <span>Report for</span>
              <code className="bg-card rounded px-2 py-0.5 font-mono text-foreground text-xs">{wallet}</code>
            </div>

            <StatusSummary stakes={data.stakes} operations={data.operations} exitTickets={data.exitTickets} />
            {data.networkStats && <NetworkStats stats={data.networkStats} />}
            <StakesSummary stakes={data.stakes} />
            <RewardsTable rewards={data.rewards} />
            <OperationsTable operations={data.operations} />
            <ExitTickets tickets={data.exitTickets} />
          </>
        )}

        {!data && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-card border border-card-border flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-muted">Enter a wallet address above to get started</p>
          </div>
        )}
      </main>

      <footer className="border-t border-card-border mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-muted text-center">
          Powered by Kiln Connect API &middot; Internal tool for Edge Wallet
        </div>
      </footer>
    </div>
  );
}

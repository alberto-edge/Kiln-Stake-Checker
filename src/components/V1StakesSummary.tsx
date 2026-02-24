"use client";

import { formatDate, shortenAddress, formatPercent } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  stakes: any[];
}

const stateBadge: Record<string, { bg: string; text: string }> = {
  active_ongoing: { bg: "bg-success/20", text: "text-success" },
  active_exiting: { bg: "bg-warning/20", text: "text-warning" },
  withdrawal_done: { bg: "bg-muted/20", text: "text-muted" },
  withdrawal_possible: { bg: "bg-accent/20", text: "text-accent" },
};

export default function V1StakesSummary({ stakes }: Props) {
  if (stakes.length === 0) return null;

  const activeStakes = stakes.filter((s: any) => s.state === "active_ongoing");
  const totalBalance = stakes.reduce((sum: number, s: any) => sum + Number(BigInt(s.balance || "0")), 0);
  const totalRewards = stakes.reduce((sum: number, s: any) => sum + Number(BigInt(s.rewards || "0")), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-4">
          ETH Validators<Tooltip text="These are individual 32 ETH validator positions on the Ethereum beacon chain, tracked through Kiln's standard reporting API." />
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          <div>
            <p className="text-xs text-muted mb-1">Total Validators</p>
            <p className="text-xl font-bold">{stakes.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Active<Tooltip text="Validators currently online and earning rewards." /></p>
            <p className="text-xl font-bold text-success">{activeStakes.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Total Balance<Tooltip text="Combined balance across all validators, including the original 32 ETH deposits." /></p>
            <p className="text-xl font-bold">{(totalBalance / 1e18).toFixed(4)} <span className="text-sm text-muted">ETH</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Total Rewards<Tooltip text="Total ETH earned across all validators from both consensus (block validation) and execution (transaction tips) rewards." /></p>
            <p className="text-xl font-bold text-success">{(totalRewards / 1e18).toFixed(6)} <span className="text-sm text-muted">ETH</span></p>
          </div>
        </div>
      </div>

      {stakes.map((stake: any, i: number) => {
        const badge = stateBadge[stake.state] || { bg: "bg-card-border", text: "text-muted" };
        const stateLabel = (stake.state || "unknown").replace(/_/g, " ");
        return (
          <div key={i} className="rounded-xl bg-card border border-card-border p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <p className="text-xs text-muted font-mono">{shortenAddress(stake.validator_address || "")}</p>
                {stake.validator_index && (
                  <p className="text-xs text-muted">Index: {stake.validator_index}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${badge.bg} ${badge.text}`}>
                  {stateLabel}
                </span>
                {stake.is_kiln && (
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-accent-dim text-accent">Kiln</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted mb-1">Balance</p>
                <p className="text-sm font-semibold">{(Number(BigInt(stake.balance || "0")) / 1e18).toFixed(4)} <span className="text-xs text-muted">ETH</span></p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Rewards</p>
                <p className="text-sm font-semibold text-success">{(Number(BigInt(stake.rewards || "0")) / 1e18).toFixed(6)} <span className="text-xs text-muted">ETH</span></p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Gross APY<Tooltip text="The annual percentage yield this validator is earning, before any fees." /></p>
                <p className="text-sm font-semibold">{stake.gross_apy ? formatPercent(stake.gross_apy) : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Activated</p>
                <p className="text-sm font-semibold">{stake.activated_at ? formatDate(stake.activated_at) : "—"}</p>
              </div>
            </div>

            {(stake.consensus_rewards || stake.execution_rewards) && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-card-border">
                <div>
                  <p className="text-xs text-muted mb-1">Consensus Rewards<Tooltip text="ETH earned from validating blocks and attesting — the base staking yield." /></p>
                  <p className="text-sm font-mono">{(Number(BigInt(stake.consensus_rewards || "0")) / 1e18).toFixed(6)} ETH</p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Execution Rewards<Tooltip text="ETH earned from transaction priority fees and MEV tips — the variable part of staking income." /></p>
                  <p className="text-sm font-mono">{(Number(BigInt(stake.execution_rewards || "0")) / 1e18).toFixed(6)} ETH</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

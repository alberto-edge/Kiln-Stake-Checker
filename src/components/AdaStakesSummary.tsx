"use client";

import type { AdaStake } from "@/lib/types";
import { formatAda, formatPercent, formatDate, shortenPoolId } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  stakes: AdaStake[];
}

export default function AdaStakesSummary({ stakes }: Props) {
  if (stakes.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-2">Staking Positions</h2>
        <p className="text-muted text-sm">No Cardano stakes found for this wallet.</p>
      </div>
    );
  }

  const totalBalance = stakes.reduce((sum, s) => sum + Number(BigInt(s.balance)), 0);
  const totalRewards = stakes.reduce((sum, s) => sum + Number(BigInt(s.rewards)), 0);
  const totalAvailable = stakes.reduce((sum, s) => sum + Number(BigInt(s.available_rewards)), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-4">Staking Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted mb-1">Total Staked<Tooltip text="The total amount of ADA currently delegated to staking pools." /></p>
            <p className="text-xl font-bold">{(totalBalance / 1e6).toFixed(2)} <span className="text-sm text-muted">ADA</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Total Rewards<Tooltip text="The total ADA earned from staking across all delegations." /></p>
            <p className="text-xl font-bold text-success">{(totalRewards / 1e6).toFixed(6)} <span className="text-sm text-muted">ADA</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Available to Withdraw<Tooltip text="Rewards that have been distributed and can be withdrawn to your wallet." /></p>
            <p className="text-xl font-bold text-warning">{(totalAvailable / 1e6).toFixed(6)} <span className="text-sm text-muted">ADA</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Delegations<Tooltip text="The number of separate stake delegations this wallet has." /></p>
            <p className="text-xl font-bold">{stakes.length}</p>
          </div>
        </div>
      </div>

      {stakes.map((stake, i) => (
        <div key={i} className="rounded-xl bg-card border border-card-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">Pool</h3>
                <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${stake.state === "active" ? "bg-success/20 text-success" : "bg-card-border text-muted"}`}>
                  {stake.state}
                </span>
              </div>
              <p className="text-xs text-muted font-mono mt-0.5">{shortenPoolId(stake.pool_id)}</p>
            </div>
            {stake.delegated_at && (
              <span className="text-xs text-muted">Delegated {formatDate(stake.delegated_at)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted mb-1">Balance<Tooltip text="How much ADA is currently staked in this delegation." /></p>
              <p className="text-lg font-semibold">{formatAda(stake.balance, 2)} <span className="text-xs text-muted">ADA</span></p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Rewards<Tooltip text="Total ADA earned from this delegation." /></p>
              <p className="text-lg font-semibold text-success">{formatAda(stake.rewards)} <span className="text-xs text-muted">ADA</span></p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Net APY<Tooltip text="Net annual percentage yield — what you actually earn after pool fees." /></p>
              <p className="text-lg font-semibold">{formatPercent(stake.net_apy)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-card-border text-sm">
            <div>
              <p className="text-xs text-muted mb-1">Pool Saturation (Active)<Tooltip text="How full the pool is. Pools over 100% saturation start losing rewards. Lower is generally better." /></p>
              <p className="font-mono">{(parseFloat(stake.active_pool_saturation) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Pool Saturation (Live)</p>
              <p className="font-mono">{(parseFloat(stake.live_pool_saturation) * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Activated Epoch<Tooltip text="The Cardano epoch when this stake became active and started earning rewards." /></p>
              <p className="font-mono">{stake.activated_epoch}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-card-border">
            <p className="text-xs text-muted">
              Stake address: <span className="font-mono">{stake.stake_address.slice(0, 20)}...{stake.stake_address.slice(-8)}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

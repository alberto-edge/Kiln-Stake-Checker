"use client";

import { Stake } from "@/lib/types";
import { formatEth, formatPercent, formatDate, shortenAddress } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  stakes: Stake[];
}

function RateCard({ label, nrr, grr }: { label: string; nrr?: number; grr?: number }) {
  if (nrr == null || grr == null) return null;
  return (
    <div className="text-center">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm font-semibold text-success">{formatPercent(nrr)} <span className="text-muted font-normal">net</span><Tooltip text="Net rate is what you actually earn after Kiln takes their fee." /></p>
      <p className="text-xs text-muted">{formatPercent(grr)} gross<Tooltip text="Gross rate is the total yield before any fees are deducted." /></p>
    </div>
  );
}

export default function StakesSummary({ stakes }: Props) {
  if (stakes.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-2">Staking Positions</h2>
        <p className="text-muted text-sm">No on-chain v2 stakes found for this wallet.</p>
      </div>
    );
  }

  const totalBalance = stakes.reduce((sum, s) => sum + Number(BigInt(s.balance)), 0);
  const totalRewards = stakes.reduce((sum, s) => sum + Number(BigInt(s.rewards)), 0);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-4">Staking Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs text-muted mb-1">Total Staked<Tooltip text="The total amount of ETH this wallet currently has locked up in Kiln staking pools." /></p>
            <p className="text-xl font-bold">{(totalBalance / 1e18).toFixed(4)} <span className="text-sm text-muted">ETH</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Total Rewards<Tooltip text="The total ETH this wallet has earned from staking. This is profit on top of what was originally deposited." /></p>
            <p className="text-xl font-bold text-success">{(totalRewards / 1e18).toFixed(6)} <span className="text-sm text-muted">ETH</span></p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Positions<Tooltip text="The number of separate staking entries this wallet has. Each one represents a distinct deposit into a pool." /></p>
            <p className="text-xl font-bold">{stakes.length}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Integrations<Tooltip text="The number of different Kiln staking pools this wallet is using. Each integration is a separate staking contract." /></p>
            <p className="text-xl font-bold">{new Set(stakes.map(s => s.integration)).size}</p>
          </div>
        </div>
      </div>

      {stakes.map((stake, i) => (
        <div key={i} className="rounded-xl bg-card border border-card-border p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-semibold">{stake.integration || "Unknown Integration"}</h3>
              <p className="text-xs text-muted font-mono">{shortenAddress(stake.integration_address)}</p>
            </div>
            {stake.delegated_at && (
              <span className="text-xs text-muted">Staked {formatDate(stake.delegated_at)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted mb-1">Balance<Tooltip text="How much ETH is currently staked in this specific position, including any accumulated rewards." /></p>
              <p className="text-lg font-semibold">{formatEth(stake.balance)} <span className="text-xs text-muted">ETH</span></p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Rewards<Tooltip text="The ETH earned from this position so far. This is your staking profit." /></p>
              <p className="text-lg font-semibold text-success">{formatEth(stake.rewards)} <span className="text-xs text-muted">ETH</span></p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-4 border-t border-card-border">
            <RateCard label="1 Week" nrr={stake.one_week?.nrr} grr={stake.one_week?.grr} />
            <RateCard label="1 Month" nrr={stake.one_month?.nrr} grr={stake.one_month?.grr} />
            <RateCard label="3 Months" nrr={stake.three_months?.nrr} grr={stake.three_months?.grr} />
            <RateCard label="6 Months" nrr={stake.six_months?.nrr} grr={stake.six_months?.grr} />
            <RateCard label="1 Year" nrr={stake.one_year?.nrr} grr={stake.one_year?.grr} />
          </div>

          {stake.structure && stake.structure.length > 0 && (
            <div className="mt-4 pt-4 border-t border-card-border">
              <p className="text-xs text-muted mb-2">Pool Structure<Tooltip text="Shows which validator pools your stake is split across and what percentage is in each. Kiln may spread your ETH across multiple pools for reliability." /></p>
              <div className="flex flex-wrap gap-2">
                {stake.structure.map((pool, j) => (
                  <span key={j} className="text-xs bg-accent-dim text-accent rounded-full px-3 py-1">
                    {pool.pool} ({(pool.share * 100).toFixed(0)}%)
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

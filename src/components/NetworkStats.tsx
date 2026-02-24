"use client";

import { NetworkStats as NetworkStatsType } from "@/lib/types";
import { formatPercent } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  stats: NetworkStatsType | null;
}

export default function NetworkStats({ stats }: Props) {
  if (!stats) return null;

  const totalSupplyEth = Number(BigInt(stats.total_underlying_supply)) / 1e18;

  return (
    <div className="rounded-xl bg-card border border-card-border p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold">Network Stats</h2>
        <span className="text-xs text-muted font-mono">{stats.name} ({stats.symbol})</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <p className="text-xs text-muted mb-1">Total Staked<Tooltip text="The total amount of ETH deposited by everyone into this staking pool — not just this wallet." /></p>
          <p className="text-lg font-bold">{totalSupplyEth.toFixed(2)} <span className="text-xs text-muted">ETH</span></p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Total Stakers<Tooltip text="How many different wallets have ETH staked in this pool." /></p>
          <p className="text-lg font-bold">{stats.total_stakers.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Fee<Tooltip text="The percentage Kiln takes from your staking rewards. For example, 10% fee means you keep 90% of the yield." /></p>
          <p className="text-lg font-bold">{stats.fee}%</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Net Rate (1m)<Tooltip text="The annualized return for this pool over the past month, after Kiln's fee. This is what stakers actually earn." /></p>
          <p className="text-lg font-bold text-success">{formatPercent(stats.nrr)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Gross Rate (1m)<Tooltip text="The annualized return for this pool over the past month, before any fees. The difference between this and the net rate is Kiln's cut." /></p>
          <p className="text-lg font-bold">{formatPercent(stats.grr)}</p>
        </div>
      </div>
    </div>
  );
}

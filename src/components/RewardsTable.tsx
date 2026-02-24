"use client";

import { Reward } from "@/lib/types";
import { formatEth, formatUsd, formatPercent, formatDate } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  rewards: Reward[];
}

export default function RewardsTable({ rewards }: Props) {
  if (rewards.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-2">Rewards History</h2>
        <p className="text-muted text-sm">No reward data found.</p>
      </div>
    );
  }

  const totalRewardsEth = rewards.reduce((sum, r) => sum + Number(BigInt(r.rewards)), 0) / 1e18;
  const totalRewardsUsd = rewards.reduce((sum, r) => sum + (r.rewards_usd ?? 0), 0);

  return (
    <div className="rounded-xl bg-card border border-card-border p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold">Rewards History</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-success font-semibold">{totalRewardsEth.toFixed(6)} ETH total</span>
          {totalRewardsUsd > 0 && (
            <span className="text-muted">{formatUsd(totalRewardsUsd)}</span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-muted text-xs text-left">
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4 text-right">Rewards (ETH)<Tooltip text="How much ETH was earned on this specific day from staking." /></th>
              <th className="pb-2 pr-4 text-right">Rewards (USD)<Tooltip text="The dollar value of that day's rewards, based on the ETH price at the end of the day." /></th>
              <th className="pb-2 pr-4 text-right">Balance (ETH)<Tooltip text="The total staked amount at the end of this day, including accumulated rewards." /></th>
              <th className="pb-2 text-right">NRR<Tooltip text="Net Reward Rate — the annualized percentage return you're earning after fees. Think of it like an interest rate on a savings account." /></th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward, i) => (
              <tr key={i} className="border-b border-card-border/50 hover:bg-card-border/20">
                <td className="py-2 pr-4 text-muted">{formatDate(reward.date)}</td>
                <td className="py-2 pr-4 text-right text-success font-mono">{formatEth(reward.rewards, 8)}</td>
                <td className="py-2 pr-4 text-right text-muted font-mono">
                  {reward.rewards_usd != null ? formatUsd(reward.rewards_usd) : "—"}
                </td>
                <td className="py-2 pr-4 text-right font-mono">{formatEth(reward.balance, 4)}</td>
                <td className="py-2 text-right">{formatPercent(reward.nrr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import type { AdaStake, AdaOperation } from "@/lib/types";

interface Props {
  stakes: AdaStake[];
  operations: AdaOperation[];
}

interface StatusItem {
  icon: string;
  color: string;
  bg: string;
  title: string;
  description: string;
}

export default function AdaStatusSummary({ stakes, operations }: Props) {
  const items: StatusItem[] = [];

  const totalBalance = stakes.reduce((sum, s) => sum + Number(BigInt(s.balance)), 0);
  const totalRewards = stakes.reduce((sum, s) => sum + Number(BigInt(s.rewards)), 0);
  const totalAvailable = stakes.reduce((sum, s) => sum + Number(BigInt(s.available_rewards)), 0);
  const activeStakes = stakes.filter(s => s.state === "active");
  const inactiveStakes = stakes.filter(s => s.state === "inactive");

  if (activeStakes.length > 0) {
    const pools = new Set(activeStakes.map(s => s.pool_id)).size;
    items.push({
      icon: "●",
      color: "text-success",
      bg: "bg-success/10 border-success/30",
      title: "Actively Delegating",
      description: `This wallet has ${(totalBalance / 1e6).toFixed(2)} ADA delegated across ${activeStakes.length} position${activeStakes.length !== 1 ? "s" : ""} to ${pools} pool${pools !== 1 ? "s" : ""}, earning ${(totalRewards / 1e6).toFixed(6)} ADA in total rewards.`,
    });
  } else if (stakes.length === 0 && operations.length === 0) {
    items.push({
      icon: "○",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: "No Staking Activity",
      description: "This wallet has no Cardano staking delegations or past operations found through Kiln.",
    });
    return <SummaryCard items={items} />;
  }

  if (inactiveStakes.length > 0) {
    items.push({
      icon: "○",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: `${inactiveStakes.length} Inactive Delegation${inactiveStakes.length !== 1 ? "s" : ""}`,
      description: `${inactiveStakes.length} stake delegation${inactiveStakes.length !== 1 ? "s are" : " is"} currently inactive and not earning rewards.`,
    });
  }

  if (totalAvailable > 0) {
    items.push({
      icon: "!",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/30",
      title: "Rewards Available to Withdraw",
      description: `There ${totalAvailable / 1e6 >= 1 ? "are" : "is"} ${(totalAvailable / 1e6).toFixed(6)} ADA in rewards available to withdraw to the wallet.`,
    });
  }

  if (operations.length > 0) {
    const delegations = operations.filter(o => o.type === "delegation");
    const rewards = operations.filter(o => o.type === "reward");
    const withdrawals = operations.filter(o => o.type === "withdrawal");
    const registrations = operations.filter(o => o.type === "stake_registration");
    const parts: string[] = [];
    if (registrations.length > 0) parts.push(`${registrations.length} registration${registrations.length !== 1 ? "s" : ""}`);
    if (delegations.length > 0) parts.push(`${delegations.length} delegation${delegations.length !== 1 ? "s" : ""}`);
    if (rewards.length > 0) parts.push(`${rewards.length} reward${rewards.length !== 1 ? "s" : ""}`);
    if (withdrawals.length > 0) parts.push(`${withdrawals.length} withdrawal${withdrawals.length !== 1 ? "s" : ""}`);
    items.push({
      icon: "↺",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: "Activity History",
      description: `This wallet has a total of ${operations.length} operation${operations.length !== 1 ? "s" : ""}: ${parts.join(", ")}.`,
    });
  }

  return <SummaryCard items={items} />;
}

function SummaryCard({ items }: { items: StatusItem[] }) {
  return (
    <div className="rounded-xl bg-card border border-card-border p-6">
      <h2 className="text-lg font-semibold mb-4">Status Summary</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className={`rounded-lg border p-4 ${item.bg}`}>
            <div className="flex items-start gap-3">
              <span className={`text-lg font-bold ${item.color} mt-0.5 w-5 text-center shrink-0`}>{item.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${item.color}`}>{item.title}</p>
                <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

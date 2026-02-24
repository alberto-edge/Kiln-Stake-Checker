"use client";

import type { Stake, Operation, ExitTicket } from "@/lib/types";
import { formatEth } from "@/lib/format";

interface Props {
  stakes: Stake[];
  operations: Operation[];
  exitTickets: ExitTicket[];
}

interface StatusItem {
  icon: string;
  color: string;
  bg: string;
  title: string;
  description: string;
}

export default function StatusSummary({ stakes, operations, exitTickets }: Props) {
  const items: StatusItem[] = [];

  const totalBalance = stakes.reduce((sum, s) => sum + Number(BigInt(s.balance)), 0);
  const totalRewards = stakes.reduce((sum, s) => sum + Number(BigInt(s.rewards)), 0);

  const claimableTickets = exitTickets.filter(t => t.state === "fulfillable");
  const pendingTickets = exitTickets.filter(t => t.state === "unfulfillable");
  const partialTickets = exitTickets.filter(t => t.state === "partially_fulfillable");
  const claimableAmount = claimableTickets.reduce((sum, t) => sum + Number(BigInt(t.retrievable_amount)), 0);
  const pendingAmount = pendingTickets.reduce((sum, t) => sum + Number(BigInt(t.exiting_amount)), 0);
  const partialRetrievable = partialTickets.reduce((sum, t) => sum + Number(BigInt(t.retrievable_amount)), 0);
  const partialExiting = partialTickets.reduce((sum, t) => sum + Number(BigInt(t.exiting_amount)), 0);

  const recentDeposits = operations.filter(o => o.type === "deposit");
  const recentExits = operations.filter(o => o.type === "exit");
  const recentClaims = operations.filter(o => o.type === "claim");

  // Active staking status
  if (totalBalance > 0) {
    items.push({
      icon: "●",
      color: "text-success",
      bg: "bg-success/10 border-success/30",
      title: "Actively Staking",
      description: `This wallet has ${(totalBalance / 1e18).toFixed(4)} ETH actively staked across ${stakes.length} position${stakes.length !== 1 ? "s" : ""} and has earned ${(totalRewards / 1e18).toFixed(6)} ETH in rewards so far.`,
    });
  } else if (stakes.length === 0 && exitTickets.length === 0 && operations.length === 0) {
    items.push({
      icon: "○",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: "No Staking Activity",
      description: "This wallet has no staking positions, no pending exits, and no past operations on Kiln's on-chain v2 pools.",
    });
    return <SummaryCard items={items} />;
  } else if (totalBalance === 0 && stakes.length === 0) {
    items.push({
      icon: "○",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: "Not Currently Staking",
      description: "This wallet does not have any active staking positions right now, but has past activity shown above.",
    });
  }

  // Claimable ETH - action needed
  if (claimableTickets.length > 0) {
    items.push({
      icon: "!",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/30",
      title: "Action Needed: ETH Ready to Claim",
      description: `There ${claimableTickets.length === 1 ? "is" : "are"} ${claimableTickets.length} exit ticket${claimableTickets.length !== 1 ? "s" : ""} with ${(claimableAmount / 1e18).toFixed(6)} ETH ready to be claimed. This ETH has finished exiting and can be withdrawn back to the wallet now.`,
    });
  }

  // Partially claimable
  if (partialTickets.length > 0) {
    items.push({
      icon: "◐",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/30",
      title: "Partially Ready to Claim",
      description: `There ${partialTickets.length === 1 ? "is" : "are"} ${partialTickets.length} exit ticket${partialTickets.length !== 1 ? "s" : ""} that ${partialTickets.length === 1 ? "is" : "are"} partially ready. ${(partialRetrievable / 1e18).toFixed(6)} ETH can be claimed now, while ${(partialExiting / 1e18).toFixed(6)} ETH is still being processed.`,
    });
  }

  // Pending exits
  if (pendingTickets.length > 0) {
    items.push({
      icon: "◷",
      color: "text-accent",
      bg: "bg-accent/10 border-accent/30",
      title: "Unstaking in Progress",
      description: `There ${pendingTickets.length === 1 ? "is" : "are"} ${pendingTickets.length} exit ticket${pendingTickets.length !== 1 ? "s" : ""} with ${(pendingAmount / 1e18).toFixed(6)} ETH still in the exit queue. This ETH is being processed and is not yet available to claim.`,
    });
  }

  // Recent activity summary
  if (operations.length > 0) {
    const parts: string[] = [];
    if (recentDeposits.length > 0) parts.push(`${recentDeposits.length} deposit${recentDeposits.length !== 1 ? "s" : ""}`);
    if (recentExits.length > 0) parts.push(`${recentExits.length} exit request${recentExits.length !== 1 ? "s" : ""}`);
    if (recentClaims.length > 0) parts.push(`${recentClaims.length} claim${recentClaims.length !== 1 ? "s" : ""}`);
    items.push({
      icon: "↺",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: "Activity History",
      description: `This wallet has a total of ${operations.length} on-chain operation${operations.length !== 1 ? "s" : ""}: ${parts.join(", ")}.`,
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

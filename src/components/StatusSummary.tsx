"use client";

import type { Stake, Operation, ExitTicket } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  stakes: Stake[];
  v1Stakes: any[];
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

export default function StatusSummary({ stakes, v1Stakes, operations, exitTickets }: Props) {
  const items: StatusItem[] = [];

  const totalBalance = stakes.reduce((sum, s) => sum + Number(BigInt(s.balance)), 0);
  const totalRewards = stakes.reduce((sum, s) => sum + Number(BigInt(s.rewards)), 0);

  const v1Active = v1Stakes.filter((s: any) => s.state === "active_ongoing");
  const v1Exiting = v1Stakes.filter((s: any) => s.state === "active_exiting");
  const v1WithdrawReady = v1Stakes.filter((s: any) => s.state === "withdrawal_possible");
  const v1Withdrawn = v1Stakes.filter((s: any) => s.state === "withdrawal_done");
  const v1TotalBalance = v1Stakes.reduce((sum: number, s: any) => sum + Number(BigInt(s.balance || "0")), 0);
  const v1TotalRewards = v1Stakes.reduce((sum: number, s: any) => sum + Number(BigInt(s.rewards || "0")), 0);

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
  } else if (stakes.length === 0 && v1Stakes.length === 0 && exitTickets.length === 0 && operations.length === 0) {
    items.push({
      icon: "○",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: "No Staking Activity",
      description: "This wallet has no staking positions, no pending exits, and no past operations found through Kiln.",
    });
    return <SummaryCard items={items} />;
  } else if (totalBalance === 0 && stakes.length === 0 && v1Stakes.length === 0) {
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

  // V1 validator-level statuses
  if (v1Active.length > 0) {
    items.push({
      icon: "●",
      color: "text-success",
      bg: "bg-success/10 border-success/30",
      title: `${v1Active.length} Active Validator${v1Active.length !== 1 ? "s" : ""}`,
      description: `This wallet has ${v1Active.length} validator${v1Active.length !== 1 ? "s" : ""} actively earning rewards with a combined balance of ${(v1TotalBalance / 1e18).toFixed(4)} ETH and ${(v1TotalRewards / 1e18).toFixed(6)} ETH in total rewards.`,
    });
  }

  if (v1Exiting.length > 0) {
    items.push({
      icon: "◷",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/30",
      title: `${v1Exiting.length} Validator${v1Exiting.length !== 1 ? "s" : ""} Exiting`,
      description: `${v1Exiting.length} validator${v1Exiting.length !== 1 ? "s are" : " is"} currently in the process of exiting. The ETH will be available to withdraw once the exit is complete.`,
    });
  }

  if (v1WithdrawReady.length > 0) {
    items.push({
      icon: "!",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/30",
      title: `Action Needed: ${v1WithdrawReady.length} Validator${v1WithdrawReady.length !== 1 ? "s" : ""} Ready to Withdraw`,
      description: `${v1WithdrawReady.length} validator${v1WithdrawReady.length !== 1 ? "s have" : " has"} finished exiting and the ETH is ready to be withdrawn.`,
    });
  }

  if (v1Withdrawn.length > 0) {
    items.push({
      icon: "✓",
      color: "text-muted",
      bg: "bg-card border-card-border",
      title: `${v1Withdrawn.length} Validator${v1Withdrawn.length !== 1 ? "s" : ""} Fully Withdrawn`,
      description: `${v1Withdrawn.length} validator${v1Withdrawn.length !== 1 ? "s have" : " has"} been fully exited and withdrawn in the past.`,
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

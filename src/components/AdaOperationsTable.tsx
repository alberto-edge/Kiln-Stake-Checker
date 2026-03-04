"use client";

import type { AdaOperation } from "@/lib/types";
import { formatAda, formatDate, shortenAddress, cardanoscanTxUrl } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  operations: AdaOperation[];
}

const typeBadge: Record<string, string> = {
  delegation: "bg-accent-dim text-accent",
  stake_registration: "bg-success/20 text-success",
  stake_deregistration: "bg-danger/20 text-danger",
  reward: "bg-success/20 text-success",
  withdrawal: "bg-warning/20 text-warning",
};

const typeLabel: Record<string, string> = {
  delegation: "Delegation",
  stake_registration: "Registration",
  stake_deregistration: "Deregistration",
  reward: "Reward",
  withdrawal: "Withdrawal",
};

export default function AdaOperationsTable({ operations }: Props) {
  if (operations.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-2">Operations</h2>
        <p className="text-muted text-sm">No operations found for this wallet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-card-border p-6">
      <h2 className="text-lg font-semibold mb-4">Operations</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border text-muted text-xs text-left">
              <th className="pb-2 pr-4">Type<Tooltip text="Registration = stake key registered. Delegation = ADA delegated to a pool. Reward = epoch rewards received. Withdrawal = rewards claimed. Deregistration = stake key removed." /></th>
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Epoch</th>
              <th className="pb-2 pr-4 text-right">Amount (ADA)<Tooltip text="The amount of ADA involved, if applicable (rewards and withdrawals)." /></th>
              <th className="pb-2">Tx Hash<Tooltip text="Transaction hash on Cardano. Click to view on Cardanoscan." /></th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op, i) => (
              <tr key={i} className="border-b border-card-border/50 hover:bg-card-border/20">
                <td className="py-2 pr-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadge[op.type] || "bg-card-border text-muted"}`}>
                    {typeLabel[op.type] || op.type}
                  </span>
                </td>
                <td className="py-2 pr-4 text-muted">{formatDate(op.time)}</td>
                <td className="py-2 pr-4 text-muted font-mono">{op.epoch}</td>
                <td className="py-2 pr-4 text-right font-mono">
                  {op.amount ? formatAda(op.amount) : "—"}
                </td>
                <td className="py-2">
                  {op.tx_hash ? (
                    <a
                      href={cardanoscanTxUrl(op.tx_hash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-xs"
                    >
                      {shortenAddress(op.tx_hash)}
                    </a>
                  ) : (
                    <span className="text-muted text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

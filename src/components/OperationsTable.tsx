"use client";

import { Operation } from "@/lib/types";
import { formatEth, formatDate, shortenAddress, etherscanTxUrl } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  operations: Operation[];
}

const typeBadge: Record<string, string> = {
  deposit: "bg-accent-dim text-accent",
  exit: "bg-warning/20 text-warning",
  claim: "bg-success/20 text-success",
};

function getAmount(op: Operation): string | null {
  if (op.type === "deposit" && op.amount) return formatEth(op.amount);
  if (op.type === "exit" && op.size) return formatEth(op.size);
  if (op.type === "claim" && op.claimed) return formatEth(op.claimed);
  return null;
}

export default function OperationsTable({ operations }: Props) {
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
              <th className="pb-2 pr-4">Type<Tooltip text="Deposit = ETH was put into staking. Exit = a request to unstake and withdraw. Claim = unstaked ETH was collected back to the wallet." /></th>
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4 text-right">Amount (ETH)<Tooltip text="How much ETH was involved in this transaction." /></th>
              <th className="pb-2 pr-4">Status<Tooltip text="For exit/claim operations, shows whether the unstaking process is complete or still in progress." /></th>
              <th className="pb-2">Tx Hash<Tooltip text="A unique ID for this transaction on the Ethereum blockchain. Click to view it on Etherscan." /></th>
            </tr>
          </thead>
          <tbody>
            {operations.map((op, i) => (
              <tr key={i} className="border-b border-card-border/50 hover:bg-card-border/20">
                <td className="py-2 pr-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${typeBadge[op.type] || "bg-card-border text-muted"}`}>
                    {op.type}
                  </span>
                </td>
                <td className="py-2 pr-4 text-muted">{formatDate(op.time)}</td>
                <td className="py-2 pr-4 text-right font-mono">{getAmount(op) ?? "—"}</td>
                <td className="py-2 pr-4 text-xs text-muted capitalize">{op.ticket_status || "—"}</td>
                <td className="py-2">
                  <a
                    href={etherscanTxUrl(op.tx_hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline font-mono text-xs"
                  >
                    {shortenAddress(op.tx_hash)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

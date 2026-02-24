"use client";

import { ExitTicket } from "@/lib/types";
import { formatEth } from "@/lib/format";
import Tooltip from "@/components/Tooltip";

interface Props {
  tickets: ExitTicket[];
}

const stateBadge: Record<string, { bg: string; text: string; label: string }> = {
  fulfillable: { bg: "bg-success/20", text: "text-success", label: "Ready to Claim" },
  unfulfillable: { bg: "bg-danger/20", text: "text-danger", label: "Not Yet Ready" },
  partially_fulfillable: { bg: "bg-warning/20", text: "text-warning", label: "Partially Ready" },
};

export default function ExitTickets({ tickets }: Props) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-card-border p-6">
        <h2 className="text-lg font-semibold mb-2">Exit Tickets</h2>
        <p className="text-muted text-sm">No exit tickets found. This wallet has no pending unstakes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-card-border p-6">
      <h2 className="text-lg font-semibold mb-4">Exit Tickets<Tooltip text="When you unstake ETH, you get an exit ticket. It tracks the status of your withdrawal — from pending to ready to claim." /></h2>
      <div className="grid gap-3">
        {tickets.map((ticket, i) => {
          const badge = stateBadge[ticket.state] || stateBadge.unfulfillable;
          const estDate = ticket.estimated_claimable_at
            ? new Date(ticket.estimated_claimable_at).toLocaleDateString("en-US", {
                year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
              })
            : null;

          return (
            <div key={i} className="rounded-lg bg-background border border-card-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${badge.bg} ${badge.text}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-muted font-mono">Ticket #{ticket.ticket_id.slice(0, 12)}...</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted mb-1">Retrievable<Tooltip text="The amount of ETH that is ready to be claimed right now and sent back to the wallet." /></p>
                  <p className="font-semibold">{formatEth(ticket.retrievable_amount)} <span className="text-xs text-muted">ETH</span></p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Still Exiting<Tooltip text="The amount of ETH still being processed for withdrawal. This ETH is in the exit queue and not yet available." /></p>
                  <p className="font-semibold">{formatEth(ticket.exiting_amount)} <span className="text-xs text-muted">ETH</span></p>
                </div>
                {estDate && (
                  <div>
                    <p className="text-xs text-muted mb-1">Est. Claimable<Tooltip text="The estimated date and time when this ETH will be ready to claim. This can shift slightly depending on network conditions." /></p>
                    <p className="font-semibold text-warning">{estDate}</p>
                  </div>
                )}
              </div>
              {ticket.cask_id && (
                <p className="mt-2 text-xs text-muted">Cask ID: {ticket.cask_id}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

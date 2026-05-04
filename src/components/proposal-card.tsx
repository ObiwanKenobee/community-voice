import { Link } from "@tanstack/react-router";
import { ArrowRight, AlertTriangle } from "lucide-react";
import type { Proposal } from "@/lib/mock-data";
import { TimeRemaining } from "./time-remaining";
import { Button } from "@/components/ui/button";

export function ProposalCard({ proposal }: { proposal: Proposal }) {
  const total = proposal.approve + proposal.reject;
  const approvePct = total === 0 ? 0 : Math.round((proposal.approve / total) * 100);
  const quorumPct = Math.min(100, Math.round((total / proposal.quorum) * 100));

  return (
    <article className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span>{proposal.region}</span>
            {proposal.flagged && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                <AlertTriangle className="h-3 w-3" /> Flagged
              </span>
            )}
          </div>
          <h3 className="font-display text-xl leading-tight">{proposal.title}</h3>
        </div>
        <TimeRemaining endsAt={proposal.endsAt} className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground" />
      </div>

      <p className="text-sm text-muted-foreground">{proposal.summary}</p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{proposal.approve} approve · {proposal.reject} reject</span>
          <span>{approvePct}% in favor</span>
        </div>
        <div className="flex h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${approvePct}%` }} />
          <div className="h-full bg-destructive/70 transition-all" style={{ width: `${100 - approvePct}%` }} />
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground">
          <span>Quorum {total}/{proposal.quorum}</span>
          <span>{quorumPct}%</span>
        </div>
      </div>

      <Button asChild className="mt-1 self-start rounded-full">
        <Link to="/proposals/$proposalId" params={{ proposalId: proposal.id }}>
          Vote now <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </Button>
    </article>
  );
}

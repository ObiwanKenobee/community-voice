import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, Check, X } from "lucide-react";
import { store, useStore } from "@/lib/governance-store";
import { TimeRemaining } from "@/components/time-remaining";
import { Button } from "@/components/ui/button";
import { CommentsSection } from "@/components/comments-section";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/proposals/$proposalId")({
  component: ProposalDetail,
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="font-display text-3xl">Proposal not found</h1>
      <Link to="/" className="mt-4 inline-block text-primary underline">Back to proposals</Link>
    </main>
  ),
});

function ProposalDetail() {
  const { proposalId } = Route.useParams();
  const proposal = useStore((s) => s.proposals.find((p) => p.id === proposalId));
  const myVote = useStore((s) => s.votes[proposalId]);

  if (!proposal) throw notFound();

  const total = proposal.approve + proposal.reject;
  const approvePct = total === 0 ? 0 : Math.round((proposal.approve / total) * 100);
  const quorumMet = total >= proposal.quorum;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to proposals
      </Link>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span>{proposal.region}</span>
        <span>·</span>
        <TimeRemaining endsAt={proposal.endsAt} />
        {proposal.flagged && (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
            <AlertTriangle className="h-3 w-3" /> Flagged
          </span>
        )}
      </div>
      <h1 className="font-display text-3xl font-semibold leading-tight md:text-4xl">{proposal.title}</h1>
      <p className="mt-3 text-muted-foreground">{proposal.description}</p>

      {proposal.flagged && (
        <div className="mt-5 flex gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div>
            <div className="font-medium text-destructive">Conflict alert from Council</div>
            <div className="text-foreground/80">{proposal.flagReason}</div>
          </div>
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg">Impact summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">{proposal.impact}</p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs">
          Linked to measurement data ↗
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg">Live tally</h2>
          <span className={cn("text-xs", quorumMet ? "text-success" : "text-muted-foreground")}>
            {quorumMet ? "Quorum met" : `${total}/${proposal.quorum} for quorum`}
          </span>
        </div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-primary">Approve · {proposal.approve}</span>
          <span className="text-destructive">Reject · {proposal.reject}</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${approvePct}%` }} />
          <div className="h-full bg-destructive/70 transition-all" style={{ width: `${100 - approvePct}%` }} />
        </div>
        <div className="mt-1 text-right text-xs text-muted-foreground">{approvePct}% in favor</div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button
            size="lg"
            variant={myVote === "approve" ? "default" : "outline"}
            onClick={() => store.vote(proposal.id, "approve")}
            className={cn("rounded-xl", myVote === "approve" && "ring-2 ring-primary/40")}
          >
            <Check className="mr-1 h-4 w-4" /> Approve
          </Button>
          <Button
            size="lg"
            variant={myVote === "reject" ? "destructive" : "outline"}
            onClick={() => store.vote(proposal.id, "reject")}
            className="rounded-xl"
          >
            <X className="mr-1 h-4 w-4" /> Reject
          </Button>
        </div>
        {myVote && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Your vote: <span className="font-medium text-foreground">{myVote}</span> (you can change it any time before voting closes).
          </p>
        )}
      </section>

      <CommentsSection proposalId={proposal.id} />
    </main>
  );
}

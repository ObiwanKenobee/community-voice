import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/governance-store";
import { ProposalCard } from "@/components/proposal-card";
import { PieChart, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Active Proposals — Common Ground" },
      { name: "description", content: "Browse and vote on active community proposals." },
    ],
  }),
  component: CommunityHome,
});

function CommunityHome() {
  const proposals = useStore((s) => s.proposals);
  const active = proposals.filter((p) => p.status === "active" || p.status === "flagged");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <section className="mb-10 flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
          Community Dashboard
        </span>
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">
          What our community is deciding this week
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Cast your vote, weigh in with comments, and follow how shared funds turn into real projects on the ground.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Link
            to="/allocation"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          >
            <PieChart className="h-4 w-4" /> Resource allocation
          </Link>
          <Link
            to="/transparency"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-secondary"
          >
            <Wallet className="h-4 w-4" /> Open ledger
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">Active proposals</h2>
          <span className="text-sm text-muted-foreground">{active.length} open</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {active.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

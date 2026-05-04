import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Users2, Activity } from "lucide-react";
import { useStore } from "@/lib/governance-store";
import { regions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/council")({
  head: () => ({
    meta: [
      { title: "Council Governance Analytics — Common Ground" },
      { name: "description", content: "Participation, voting distribution, and conflict alerts." },
    ],
  }),
  component: CouncilPage,
});

// Mock heatmap: regions x weekday participation (0..1)
const heatmapData: Record<string, number[]> = {
  "North Valley": [0.4, 0.6, 0.8, 0.9, 0.7, 0.5, 0.3],
  "East Mesa":    [0.3, 0.5, 0.6, 0.8, 0.9, 0.6, 0.4],
  "South Ridge":  [0.2, 0.3, 0.45, 0.5, 0.6, 0.4, 0.25],
  "West Flats":   [0.5, 0.7, 0.85, 0.95, 0.8, 0.6, 0.45],
};
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CouncilPage() {
  const proposals = useStore((s) => s.proposals);
  const flagged = proposals.filter((p) => p.flagged);
  const totalVotes = proposals.reduce((s, p) => s + p.approve + p.reject, 0);
  const eligible = 1800;
  const participation = Math.min(100, Math.round((totalVotes / eligible) * 100));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
        Council Dashboard
      </span>
      <h1 className="mt-3 font-display text-4xl font-semibold">Governance analytics</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        A bird's-eye view of how the community is engaging — and where attention is needed.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Participation rate" value={`${participation}%`} sub={`${totalVotes.toLocaleString()} of ${eligible.toLocaleString()} eligible`} icon={<Users2 className="h-5 w-5" />} accent="primary" />
        <Stat label="Active proposals" value={String(proposals.filter((p) => p.status === "active" || p.status === "flagged").length)} sub="Open for voting" icon={<Activity className="h-5 w-5" />} accent="accent" />
        <Stat label="Conflict alerts" value={String(flagged.length)} sub="Flagged for review" icon={<AlertTriangle className="h-5 w-5" />} accent="destructive" />
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">Voting distribution heatmap</h2>
          <p className="text-xs text-muted-foreground">Engagement by region across the week.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-1 text-xs">
              <thead>
                <tr>
                  <th></th>
                  {days.map((d) => <th key={d} className="font-medium text-muted-foreground">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {regions.map((r) => (
                  <tr key={r}>
                    <td className="pr-2 text-right text-muted-foreground">{r}</td>
                    {(heatmapData[r] ?? []).map((v, i) => (
                      <td key={i}>
                        <div
                          className="h-9 w-full rounded-md border border-border/40"
                          style={{ background: `color-mix(in oklab, var(--primary) ${Math.round(v * 90)}%, var(--card))` }}
                          title={`${r} · ${days[i]} · ${Math.round(v * 100)}%`}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
            Low
            <div className="flex">
              {[10, 30, 50, 70, 90].map((v) => (
                <span key={v} className="h-3 w-6" style={{ background: `color-mix(in oklab, var(--primary) ${v}%, var(--card))` }} />
              ))}
            </div>
            High
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">Conflict alerts</h2>
          <p className="text-xs text-muted-foreground">Proposals flagged for council review.</p>
          <ul className="mt-4 space-y-3">
            {flagged.length === 0 && (
              <li className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">All clear — no flagged proposals.</li>
            )}
            {flagged.map((p) => (
              <li key={p.id} className="rounded-xl border border-destructive/30 bg-destructive/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div className="flex-1">
                    <Link to="/proposals/$proposalId" params={{ proposalId: p.id }} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                    <div className="mt-1 text-xs text-foreground/80">{p.flagReason}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: React.ReactNode; accent: "primary" | "accent" | "destructive" }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={cn(
          "grid h-8 w-8 place-items-center rounded-full",
          accent === "primary" && "bg-primary/10 text-primary",
          accent === "accent" && "bg-accent/10 text-accent",
          accent === "destructive" && "bg-destructive/10 text-destructive",
        )}>{icon}</span>
      </div>
      <div className="mt-2 font-display text-3xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

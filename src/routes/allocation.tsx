import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/governance-store";
import { allocations, categories } from "@/lib/mock-data";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/allocation")({
  head: () => ({
    meta: [
      { title: "Resource Allocation — Common Ground" },
      { name: "description", content: "How shared funds are distributed across community projects." },
    ],
  }),
  component: AllocationPage,
});

const COLORS = [
  "var(--moss)",
  "var(--terracotta)",
  "var(--clay)",
  "var(--leaf)",
  "var(--warning)",
];

function AllocationPage() {
  // include in store so future-proof; use static for now
  void useStore((s) => s.proposals.length);

  const byCategory = categories.map((cat) => ({
    name: cat,
    value: allocations.filter((a) => a.category === cat).reduce((s, a) => s + a.amount, 0),
  })).filter((d) => d.value > 0);

  const total = allocations.reduce((s, a) => s + a.amount, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
        Resource allocation
      </span>
      <h1 className="mt-3 font-display text-4xl font-semibold">Where the funds flow</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Total committed this cycle: <span className="font-semibold text-foreground">${total.toLocaleString()}</span> across {allocations.length} projects.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">By category</h2>
          <div className="mt-2 h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }}
                  formatter={(v: number) => `$${v.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {byCategory.map((d, i) => (
              <li key={d.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="flex-1">{d.name}</span>
                <span className="text-muted-foreground">${d.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3 font-display text-lg">Funded projects</div>
          <ul className="divide-y divide-border">
            {allocations.map((a) => (
              <li key={a.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 text-sm">
                <div>
                  <div className="font-medium">{a.project}</div>
                  <div className="text-xs text-muted-foreground">{a.region} · {a.category} · {a.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${a.amount.toLocaleString()}</div>
                  <div className={`text-xs ${a.status === "Completed" ? "text-success" : a.status === "In Progress" ? "text-accent" : "text-muted-foreground"}`}>
                    {a.status}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

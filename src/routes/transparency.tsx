import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { allocations, regions, categories, type Allocation } from "@/lib/mock-data";
import { Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transparency")({
  head: () => ({
    meta: [
      { title: "Open Ledger — Common Ground" },
      { name: "description", content: "Transparent timeline of every community fund allocation." },
    ],
  }),
  component: TransparencyPage,
});

function TransparencyPage() {
  const [region, setRegion] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allocations
      .filter((a) => (region === "all" ? true : a.region === region))
      .filter((a) => (category === "all" ? true : a.category === category))
      .filter((a) => (from ? a.date >= from : true))
      .filter((a) => (to ? a.date <= to : true))
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [region, category, from, to]);

  const total = filtered.reduce((s, a) => s + a.amount, 0);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-clay/15 px-3 py-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--clay)" }}>
        Public · Open Ledger
      </span>
      <h1 className="mt-3 font-display text-4xl font-semibold">Every dollar, in the open</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        A timeline of community allocations. Filter by region, project, or date — nothing is hidden.
      </p>

      <div className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[auto_1fr_1fr_1fr_1fr]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground"><Filter className="h-4 w-4" /> Filters</div>
        <Select label="Region" value={region} onChange={setRegion} options={["all", ...regions]} />
        <Select label="Project" value={category} onChange={setCategory} options={["all", ...categories]} />
        <DateInput label="From" value={from} onChange={setFrom} />
        <DateInput label="To" value={to} onChange={setTo} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>{filtered.length} entries</span>
        <span>Total shown: <span className="font-semibold text-foreground">${total.toLocaleString()}</span></span>
      </div>

      <ol className="relative mt-6 ml-3 border-l-2 border-dashed border-border">
        {filtered.length === 0 && (
          <li className="ml-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            No allocations match these filters.
          </li>
        )}
        {filtered.map((a) => (
          <TimelineItem key={a.id} a={a} open={openId === a.id} onToggle={() => setOpenId(openId === a.id ? null : a.id)} />
        ))}
      </ol>
    </main>
  );
}

function TimelineItem({ a, open, onToggle }: { a: Allocation; open: boolean; onToggle: () => void }) {
  return (
    <li className="relative mb-5 ml-6">
      <span className="absolute -left-[34px] top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
      </span>
      <button
        onClick={onToggle}
        className={cn(
          "w-full rounded-2xl border border-border bg-card p-4 text-left transition-shadow hover:shadow-md",
          open && "shadow-md ring-1 ring-primary/20",
        )}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{a.date} · {a.region}</div>
          <div className="font-display text-xl text-primary">${a.amount.toLocaleString()}</div>
        </div>
        <div className="mt-1 font-medium">${a.amount.toLocaleString()} allocated to {a.project}</div>
        <div className="mt-1 text-xs text-muted-foreground">{a.category} · {a.status}</div>
        {open && (
          <div className="mt-3 grid gap-2 border-t border-border pt-3 text-sm sm:grid-cols-3">
            <Detail label="Status" value={a.status} />
            <Detail label="Category" value={a.category} />
            <Detail label="Region" value={a.region} />
            <p className="sm:col-span-3 text-muted-foreground">
              Disbursed via the community treasury under the {a.category.toLowerCase()} working group. Receipts and quarterly impact reports are linked from this entry.
            </p>
          </div>
        )}
      </button>
    </li>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col text-xs">
      <span className="mb-1 text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === "all" ? `All ${label.toLowerCase()}s` : o}</option>
        ))}
      </select>
    </label>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col text-xs">
      <span className="mb-1 text-muted-foreground">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
      />
    </label>
  );
}

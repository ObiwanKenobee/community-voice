import { useEffect, useRef, useState } from "react";
import { Mic, Send, Square, Play, Pause, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { store, useStore } from "@/lib/governance-store";
import { cn } from "@/lib/utils";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const speakers = ["You", "Anya P.", "Tomás L.", "Riya N."];

export function CommentsSection({ proposalId }: { proposalId: string }) {
  const comments = useStore((s) => s.comments.filter((c) => c.proposalId === proposalId));
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const recRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => { if (recRef.current) clearInterval(recRef.current); }, []);

  const submitText = () => {
    const t = text.trim();
    if (!t) return;
    store.addComment({ proposalId, author: "You", text: t, type: "text" });
    setText("");
  };

  const startRec = () => {
    setRecording(true);
    setRecSec(0);
    recRef.current = setInterval(() => setRecSec((s) => s + 1), 1000);
  };

  const stopRec = () => {
    setRecording(false);
    if (recRef.current) clearInterval(recRef.current);
    const dur = Math.max(2, recSec);
    store.addComment({
      proposalId,
      author: "You",
      text: "Voice comment (transcript pending)",
      type: "voice",
      durationSec: dur,
    });
    setRecSec(0);
  };

  const togglePlay = (id: string) => {
    setPlayingId((cur) => (cur === id ? null : id));
    setTimeout(() => setPlayingId((cur) => (cur === id ? null : cur)), 1800);
  };

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg">Discussion</h2>
        <span className="text-xs text-muted-foreground">· {comments.length} comment{comments.length === 1 ? "" : "s"}</span>
      </div>

      <ul className="mb-5 space-y-3">
        {comments.length === 0 && (
          <li className="rounded-lg border border-dashed border-border/70 p-4 text-center text-sm text-muted-foreground">
            Be the first to share thoughts on this proposal.
          </li>
        )}
        {comments.map((c) => {
          const initial = c.author.charAt(0);
          return (
            <li key={c.id} className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary font-medium text-secondary-foreground">
                {initial}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{c.author}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(c.createdAt)}</span>
                  {c.type === "voice" && (
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent">
                      Voice
                    </span>
                  )}
                </div>
                {c.type === "voice" ? (
                  <div className="mt-2 flex items-center gap-3 rounded-lg bg-muted/60 p-2">
                    <button
                      onClick={() => togglePlay(c.id)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"
                    >
                      {playingId === c.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <div className="flex flex-1 items-center gap-1">
                      {Array.from({ length: 22 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "w-1 rounded-full bg-primary/60",
                            playingId === c.id ? "animate-pulse" : "",
                          )}
                          style={{ height: `${6 + ((i * 7) % 18)}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{c.durationSec ?? 0}s</span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-foreground/90">{c.text}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="rounded-xl border border-border bg-background p-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your perspective…"
          rows={2}
          className="resize-none border-0 bg-transparent p-1 shadow-none focus-visible:ring-0"
        />
        <div className="mt-2 flex items-center justify-between">
          <Button
            type="button"
            variant={recording ? "destructive" : "outline"}
            size="sm"
            onClick={recording ? stopRec : startRec}
            className="rounded-full"
          >
            {recording ? (
              <>
                <Square className="mr-1 h-3.5 w-3.5" /> Stop · {recSec}s
              </>
            ) : (
              <>
                <Mic className="mr-1 h-3.5 w-3.5" /> Voice
              </>
            )}
          </Button>
          <Button size="sm" onClick={submitText} disabled={!text.trim()} className="rounded-full">
            <Send className="mr-1 h-3.5 w-3.5" /> Post
          </Button>
        </div>
        {recording && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" /> Recording…
          </div>
        )}
      </div>
      <span className="sr-only">{speakers.join(",")}</span>
    </section>
  );
}

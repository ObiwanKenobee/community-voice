import { useEffect, useState } from "react";
import { timeRemaining } from "@/lib/mock-data";

export function TimeRemaining({ endsAt, className }: { endsAt: number; className?: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(i);
  }, []);
  return <span className={className}>{timeRemaining(endsAt)}</span>;
}

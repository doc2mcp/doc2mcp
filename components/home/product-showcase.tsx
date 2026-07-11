"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TypewriterText } from "@/components/animations/typewriter-text";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 0, chip: "01 Paste URL", label: "Paste URL" },
  { id: 1, chip: "02 Crawling", label: "Crawling" },
  { id: 2, chip: "03 Structure", label: "Structure" },
  { id: 3, chip: "04 MCP Gen", label: "MCP Gen" },
  { id: 4, chip: "05 Connect", label: "Connect" },
] as const;

const STEP_MS = 2400;

const CRAWL_TREE = [
  "stripe-docs/",
  "  api-reference/",
  "    charges.mdx",
  "    customers.mdx",
  "    refunds.mdx",
  "  checkout/",
  "  billing/",
];

const TOOLS = [
  "create_payment_intent",
  "list_customers",
  "retrieve_charge",
  "create_refund",
];

function StepPanel({ step }: { step: number }) {
  if (step === 0) {
    return (
      <div className="font-mono text-[11px] leading-relaxed text-emerald-400/90">
        <TypewriterText
          active
          showCursor
          speed={32}
          text="https://docs.stripe.com"
        />
        <p className="mt-3 text-muted-foreground/80">
          # doc2mcp parsing triggered
        </p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <ul className="space-y-1 font-mono text-[10.5px] text-zinc-300">
        {CRAWL_TREE.map((line, index) => (
          <motion.li
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -8 }}
            key={line}
            transition={{ delay: index * 0.08, duration: 0.35 }}
          >
            <span className="text-emerald-400/90">{line}</span>
          </motion.li>
        ))}
        <motion.p
          animate={{ opacity: 1 }}
          className="mt-3 text-emerald-500/80 text-[10px]"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          discovered: 1,284 pages · 52 pages/sec
        </motion.p>
      </ul>
    );
  }

  if (step === 2) {
    return (
      <pre className="font-mono text-[10.5px] leading-relaxed text-zinc-300">
        {`chunks      → 4,182
schemas     → 312
embeddings  → 4,182 × 1536
retrieval   → AI Engine`}
      </pre>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-2">
        {TOOLS.map((tool, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 font-mono text-[10px] text-violet-200"
            initial={{ opacity: 0, y: 6 }}
            key={tool}
            transition={{ delay: index * 0.12, duration: 0.35 }}
          >
            {tool}()
          </motion.div>
        ))}
        <p className="pt-1 font-mono text-[10px] text-muted-foreground">
          tools: 23 · workflows: 6
        </p>
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto font-mono text-[10px] leading-relaxed text-zinc-300">
      {`{
  "mcpServers": {
    "stripe": {
      "url": "https://doc2mcp.site/api/mcp/<id>/mcp",
      "headers": {
        "Authorization": "Bearer <token>"
      }
    }
  }
}`}
    </pre>
  );
}

export function ProductShowcase({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);

  const restart = useCallback(() => {
    setStep(0);
    setPlaying(false);
    window.requestAnimationFrame(() => setPlaying(true));
  }, []);

  useEffect(() => {
    if (reduce || !playing) {
      return;
    }

    const id = setInterval(() => {
      setStep((current) => (current + 1) % STEPS.length);
    }, STEP_MS);

    return () => clearInterval(id);
  }, [playing, reduce]);

  useEffect(() => {
    if (reduce) {
      setStep(4);
      setPlaying(false);
    }
  }, [reduce]);

  const progress = reduce ? 100 : ((step + 1) / STEPS.length) * 100;

  return (
    <div
      className={cn(
        "landing-glass flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-white/[0.06] border-b px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-amber-400/80" />
          <span className="size-2 rounded-full bg-emerald-400/80" />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
          doc2mcp pipeline
        </span>
        <button
          className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-muted-foreground transition-all hover:border-[var(--landing-accent)]/40 hover:text-foreground active:scale-[0.98]"
          onClick={restart}
          type="button"
        >
          <RotateCcw className="size-3" />
          Replay
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 border-white/[0.06] border-b px-3 py-2.5">
        {STEPS.map((item) => {
          const active = step === item.id;
          return (
            <span
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[9px] transition-all duration-300",
                active
                  ? "border-[var(--landing-accent)]/50 bg-[var(--landing-accent-subtle)] text-[var(--landing-accent-hover)] shadow-[0_0_20px_var(--landing-accent-glow)]"
                  : "border-white/[0.06] bg-white/[0.02] text-muted-foreground"
              )}
              key={item.chip}
            >
              {item.chip}
            </span>
          );
        })}
      </div>

      <div className="relative flex-1 overflow-hidden bg-[var(--landing-terminal-bg,#0a0a0c)] p-4">
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            initial={{ opacity: 0, y: 8 }}
            key={`${String(step)}-${String(playing)}`}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <StepPanel step={step} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="border-white/[0.06] border-t px-4 py-2">
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full bg-[var(--landing-accent)]"
            transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="font-mono text-[10px] text-emerald-400/90">
          ● Ready · 23 tools · 1,284 pages · 52 pg/s
        </p>
      </div>
    </div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CountUp } from "@/components/animations/count-up";
import { FadeUp } from "@/components/animations/fade-up";
import { ProductShowcase } from "@/components/home/product-showcase";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";

const words = [
  "AI Tools",
  "Cursor Context",
  "Claude Servers",
  "Knowledge bases",
];

const EXAMPLES = [
  "https://docs.stripe.com",
  "https://github.com/langchain-ai/langchain",
  "https://mintlify.com/docs",
];

const STATS = [
  { value: "<60s", label: "docs → MCP", tag: "PIPELINE" },
  { value: "1 URL", label: "paste & go", tag: "INPUT" },
  { value: "Hosted", label: "no install", tag: "REMOTE" },
  { value: "5+", label: "MCP clients", tag: "EXPORTS" },
];

export function HeroSection() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
    const delay = reduce ? 0 : 800;
    const id = setTimeout(() => setShowDemo(true), delay);
    return () => clearTimeout(id);
  }, [reduce]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      return;
    }

    router.push(`/chat?url=${encodeURIComponent(urlInput.trim())}`);
  };

  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-36">
      <div className="landing-hero-glow pointer-events-none absolute inset-0" />
      <div className="noise-texture pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-[clamp(20px,5vw,40px)]">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 xl:gap-14">
          <motion.div
            animate={mounted ? { opacity: 1, y: 0 } : false}
            className="text-left"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-bg-glass)] px-3.5 py-1.5 font-mono text-[10px] text-[var(--landing-text-secondary)] uppercase tracking-[0.14em] backdrop-blur-md">
              Any URL to Model Context Protocol
            </div>

            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-[-0.03em]">
              <span className="block text-[var(--landing-text-primary)]">
                Turn Any Documentation
              </span>
              <div className="relative mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                <LayoutTextFlip duration={3000} text="Into " words={words} />
              </div>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-[1.7] text-[var(--landing-text-secondary)] font-light sm:text-lg">
              Paste a docs URL—Mintlify, Docusaurus, GitHub, OpenAPI—and get a
              hosted, Cursor-ready MCP server in seconds. No setup, no local
              scripts.
            </p>

            <motion.form
              className="landing-input mt-8 flex w-full max-w-[620px] items-center rounded-xl p-1.5"
              data-tour="hero-url"
              onSubmit={handleSubmit}
            >
              <input
                className="flex-1 bg-transparent px-4 py-3 font-mono text-[var(--landing-text-primary)] text-sm outline-none placeholder:text-[var(--landing-text-tertiary)]"
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste documentation URL (e.g. docs.stripe.com)..."
                type="text"
                value={urlInput}
              />
              <button
                className="landing-accent-btn flex shrink-0 items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium"
                type="submit"
              >
                Generate
                <ArrowRight className="size-3.5" />
              </button>
            </motion.form>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-[var(--landing-text-secondary)] text-xs">
              <span>Try an example:</span>
              {EXAMPLES.map((ex) => (
                <button
                  className="landing-chip rounded-full px-3 py-1 font-mono text-[11px] text-[var(--landing-text-secondary)]"
                  key={ex}
                  onClick={() => setUrlInput(ex)}
                  type="button"
                >
                  {ex.replace("https://", "")}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate={showDemo ? { opacity: 1, y: 0 } : false}
            className="w-full"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {showDemo ? <ProductShowcase /> : null}
          </motion.div>
        </div>

        <FadeUp className="mt-14 grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div
              className="landing-stat-card rounded-xl px-4 py-4 text-left"
              key={stat.tag}
            >
              <p className="font-display text-2xl text-[var(--landing-text-primary)] tracking-tight sm:text-3xl">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-1 text-[var(--landing-text-secondary)] text-xs">
                {stat.label}
              </p>
              <p className="mt-3 font-mono text-[10px] text-[var(--landing-text-tertiary)] uppercase tracking-wider">
                {stat.tag}
              </p>
            </div>
          ))}
        </FadeUp>
      </div>
    </section>
  );
}

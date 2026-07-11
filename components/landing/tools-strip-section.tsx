"use client";

import Image from "next/image";

type Tool = {
  name: string;
  icon: string;
  invertOnDark?: boolean;
};

const TOOLS: Tool[] = [
  { name: "Cursor", icon: "/icons/tools/cursor.svg", invertOnDark: true },
  { name: "Claude Desktop", icon: "/icons/tools/claude.svg" },
  {
    name: "VS Code",
    icon: "/icons/tools/visualstudiocode.svg",
    invertOnDark: true,
  },
  { name: "Claude Code", icon: "/icons/tools/claude.svg" },
  {
    name: "Windsurf",
    icon: "/icons/tools/windsurf.svg",
    invertOnDark: true,
  },
  { name: "Codex", icon: "/icons/tools/openai.svg", invertOnDark: true },
  { name: "Gemini CLI", icon: "/icons/tools/googlegemini.svg" },
  { name: "ChatGPT", icon: "/icons/tools/openai.svg", invertOnDark: true },
  { name: "Zed", icon: "/icons/tools/zedindustries.svg" },
];

const MARQUEE = [...TOOLS, ...TOOLS];
const ROW_A = MARQUEE;
const ROW_B = [...TOOLS.slice().reverse(), ...TOOLS.slice().reverse()];

function ToolPill({ tool }: { tool: Tool }) {
  return (
    <div
      aria-hidden="true"
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--landing-border)] bg-[var(--landing-bg-glass)] px-3.5 py-2 text-[var(--landing-text-primary)]/85 text-sm transition-colors hover:border-[var(--landing-border-hover)] hover:text-[var(--landing-text-primary)]"
    >
      <Image
        alt=""
        className={
          tool.invertOnDark ? "size-4 shrink-0 dark:invert" : "size-4 shrink-0"
        }
        height={16}
        src={tool.icon}
        width={16}
      />
      <span className="whitespace-nowrap font-medium">{tool.name}</span>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Tool[];
  reverse?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="tools-marquee relative w-full"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className={`tools-marquee-track flex w-max items-center gap-3 sm:gap-3.5 ${reverse ? "tools-marquee-reverse" : ""}`}
      >
        {items.map((tool, i) => (
          <ToolPill key={`${tool.name}-${String(i)}`} tool={tool} />
        ))}
      </div>
    </div>
  );
}

export function ToolsStripSection() {
  return (
    <section className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,40px)]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[var(--landing-text-secondary)] uppercase tracking-[0.18em] sm:text-xs">
            <span className="h-px w-8 bg-[var(--landing-border-hover)]" />
            Ecosystem
            <span className="h-px w-8 bg-[var(--landing-border-hover)]" />
          </span>
          <p className="mt-3 font-display text-[var(--landing-text-primary)] text-xl tracking-tight sm:text-2xl">
            Built for the modern AI ecosystem
          </p>
          <p className="mt-2 text-[var(--landing-text-secondary)] text-sm">
            One MCP server, ready to plug into every major AI editor and agent
            runtime.
          </p>
        </div>

        <ul className="sr-only">
          {TOOLS.map((tool) => (
            <li key={tool.name}>{tool.name}</li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:mt-10">
          <MarqueeRow items={ROW_A} />
          <MarqueeRow items={ROW_B} reverse />
        </div>

        <p className="mt-7 text-center text-[var(--landing-text-tertiary)] text-xs sm:mt-8">
          Plus any MCP-compatible AI tool via manual configuration.
        </p>
      </div>

      <style>{`
        .tools-marquee { overflow: hidden; }
        .tools-marquee-track {
          animation: tools-marquee-scroll 38s linear infinite;
          will-change: transform;
        }
        .tools-marquee-reverse.tools-marquee-track {
          animation-direction: reverse;
          animation-duration: 44s;
        }
        .tools-marquee:hover .tools-marquee-track { animation-play-state: paused; }
        @keyframes tools-marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .tools-marquee-track { animation: none; }
        }
      `}</style>
    </section>
  );
}

import { cn } from "@/lib/utils";

type PipelineDiagramProps = {
  className?: string;
};

export function PipelineDiagram({ className }: PipelineDiagramProps) {
  return (
    <svg
      aria-label="The doc2mcp pipeline: Documentation to Crawling to Knowledge Processing to Retrieval to MCP Generation to AI Agents"
      className={cn("h-auto w-full", className)}
      role="img"
      viewBox="0 0 1280 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>The doc2mcp pipeline</title>

      <rect
        className="fill-background stroke-border"
        height="300"
        rx="12"
        strokeWidth="2"
        width="1280"
      />
      <rect
        className="fill-none stroke-border/70"
        height="284"
        rx="8"
        strokeWidth="2"
        width="1264"
        x="8"
        y="8"
      />

      <text
        className="fill-foreground font-semibold"
        fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
        fontSize="24"
        x="36"
        y="42"
      >
        The doc2mcp pipeline
      </text>
      <text
        className="fill-muted-foreground"
        fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
        fontSize="16"
        x="36"
        y="68"
      >
        Documentation → AI agents
      </text>

      {/* 1 Documentation */}
      <g transform="translate(24, 92)">
        <path
          className="fill-blue-50 stroke-blue-400 dark:fill-[#1e3a5f] dark:stroke-[#74c0fc]"
          d="M4 6 C6 2 12 4 18 3 L158 5 C164 3 170 6 168 12 L166 118 C168 124 162 128 156 126 L12 128 C6 130 2 122 4 116 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <path
          className="fill-blue-100 stroke-blue-600 dark:fill-[#a5d8ff] dark:stroke-[#1971c2]"
          d="M22 24 L22 68 C22 72 26 74 30 72 L52 68 C56 66 58 62 56 58 L56 20 C56 16 52 14 48 16 L26 22 C24 23 22 24 22 24 Z"
          strokeLinejoin="round"
          strokeWidth="2"
        />
        <path
          className="fill-blue-50 stroke-blue-600 dark:fill-[#d0ebff] dark:stroke-[#1971c2]"
          d="M56 20 L56 28 L48 30 L48 16 Z"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          className="stroke-blue-600 dark:stroke-[#1971c2]"
          d="M30 36 L52 32 M30 46 L48 42 M30 56 L44 52"
          fill="none"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="44"
        >
          Documentation
        </text>
        <text
          className="fill-muted-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="14"
          x="72"
          y="66"
        >
          Any docs URL
        </text>
      </g>

      <path
        className="stroke-muted-foreground"
        d="M196 156 C204 150 210 156 218 156 L228 156"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        className="stroke-muted-foreground"
        d="M224 150 L234 156 L224 162"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />

      {/* 2 Crawling */}
      <g transform="translate(216, 92)">
        <path
          className="fill-emerald-50 stroke-emerald-400 dark:fill-[#1b3d2f] dark:stroke-[#69db7c]"
          d="M4 6 C6 2 12 4 18 3 L158 5 C164 3 170 6 168 12 L166 118 C168 124 162 128 156 126 L12 128 C6 130 2 122 4 116 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <ellipse
          className="fill-emerald-100 stroke-emerald-600 dark:fill-[#b2f2bb] dark:stroke-[#2f9e44]"
          cx="42"
          cy="48"
          rx="22"
          ry="22"
          strokeWidth="2"
        />
        <path
          className="stroke-emerald-600 dark:stroke-[#2f9e44]"
          d="M20 48 C28 38 36 38 42 48 C48 58 56 58 64 48"
          fill="none"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="44"
        >
          Crawling
        </text>
        <text
          className="fill-muted-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="14"
          x="72"
          y="66"
        >
          Fetch + preserve
        </text>
      </g>

      <path
        className="stroke-muted-foreground"
        d="M388 156 L408 156"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        className="stroke-muted-foreground"
        d="M404 150 L414 156 L404 162"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />

      {/* 3 Knowledge Processing */}
      <g transform="translate(408, 92)">
        <path
          className="fill-amber-50 stroke-amber-400 dark:fill-[#3d3a1f] dark:stroke-[#ffd43b]"
          d="M4 6 C6 2 12 4 18 3 L158 5 C164 3 170 6 168 12 L166 118 C168 124 162 128 156 126 L12 128 C6 130 2 122 4 116 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <rect
          className="fill-amber-100 stroke-amber-600 dark:fill-[#ffec99] dark:stroke-[#f08c00]"
          height="20"
          rx="2"
          strokeWidth="2"
          transform="rotate(-10 24 64)"
          width="12"
          x="18"
          y="54"
        />
        <rect
          className="fill-amber-200 stroke-amber-600 dark:fill-[#ffe066] dark:stroke-[#f08c00]"
          height="24"
          rx="2"
          strokeWidth="2"
          width="12"
          x="32"
          y="50"
        />
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="40"
        >
          Knowledge
        </text>
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="60"
        >
          Processing
        </text>
        <text
          className="fill-muted-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="14"
          x="72"
          y="82"
        >
          Chunk + index
        </text>
      </g>

      <path
        className="stroke-muted-foreground"
        d="M580 156 L600 156"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        className="stroke-muted-foreground"
        d="M596 150 L606 156 L596 162"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />

      {/* 4 Retrieval */}
      <g transform="translate(600, 92)">
        <path
          className="fill-orange-50 stroke-orange-400 dark:fill-[#3d2e1a] dark:stroke-[#ffa94d]"
          d="M4 6 C6 2 12 4 18 3 L158 5 C164 3 170 6 168 12 L166 118 C168 124 162 128 156 126 L12 128 C6 130 2 122 4 116 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <circle
          className="fill-orange-100 stroke-orange-600 dark:fill-[#ffd8a8] dark:stroke-[#e8590c]"
          cx="40"
          cy="48"
          r="16"
          strokeWidth="2.2"
        />
        <path
          className="stroke-orange-600 dark:stroke-[#e8590c]"
          d="M50 58 L62 72"
          strokeLinecap="round"
          strokeWidth="3.2"
        />
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="44"
        >
          Retrieval
        </text>
        <text
          className="fill-muted-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="14"
          x="72"
          y="66"
        >
          Ranked sections
        </text>
      </g>

      <path
        className="stroke-muted-foreground"
        d="M772 156 L792 156"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        className="stroke-muted-foreground"
        d="M788 150 L798 156 L788 162"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />

      {/* 5 MCP Generation */}
      <g transform="translate(792, 92)">
        <path
          className="fill-violet-50 stroke-violet-400 dark:fill-[#2e2550] dark:stroke-[#b197fc]"
          d="M4 6 C6 2 12 4 18 3 L158 5 C164 3 170 6 168 12 L166 118 C168 124 162 128 156 126 L12 128 C6 130 2 122 4 116 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <rect
          className="fill-violet-100 stroke-violet-600 dark:fill-[#d0bfff] dark:stroke-[#7950f2]"
          height="44"
          rx="4"
          strokeWidth="2"
          width="38"
          x="22"
          y="28"
        />
        <path
          className="stroke-violet-600 dark:stroke-[#7950f2]"
          d="M28 38 L54 38 M28 48 L50 48 M28 58 L46 58"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="40"
        >
          MCP
        </text>
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="60"
        >
          Generation
        </text>
        <text
          className="fill-muted-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="14"
          x="72"
          y="82"
        >
          Hosted endpoint
        </text>
      </g>

      <path
        className="stroke-muted-foreground"
        d="M964 156 L984 156"
        fill="none"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        className="stroke-muted-foreground"
        d="M980 150 L990 156 L980 162"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />

      {/* 6 AI Agents */}
      <g transform="translate(984, 92)">
        <path
          className="fill-rose-50 stroke-rose-400 dark:fill-[#3d1f2a] dark:stroke-[#ff8787]"
          d="M4 6 C6 2 12 4 18 3 L158 5 C164 3 170 6 168 12 L166 118 C168 124 162 128 156 126 L12 128 C6 130 2 122 4 116 Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
        <rect
          className="fill-rose-100 stroke-rose-600 dark:fill-[#ffc9c9] dark:stroke-[#e03131]"
          height="40"
          rx="7"
          strokeWidth="2"
          width="36"
          x="24"
          y="30"
        />
        <path
          className="stroke-rose-600 dark:stroke-[#e03131]"
          d="M32 60 C38 66 46 66 52 60"
          fill="none"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <text
          className="fill-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="18"
          fontWeight="600"
          x="72"
          y="44"
        >
          AI Agents
        </text>
        <text
          className="fill-muted-foreground"
          fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
          fontSize="14"
          x="72"
          y="66"
        >
          Cursor · Claude
        </text>
      </g>

      <path
        className="stroke-border"
        d="M36 248 C400 242 880 252 1244 244"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <text
        className="fill-muted-foreground"
        fontFamily="var(--font-geist-sans, system-ui, sans-serif)"
        fontSize="14"
        x="36"
        y="278"
      >
        doc2mcp end-to-end flow
      </text>
    </svg>
  );
}

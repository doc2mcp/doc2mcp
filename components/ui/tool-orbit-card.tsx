"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { MCP_TOOL_ICONS } from "@/lib/config/mcp-tool-icons";
import { cn } from "@/lib/utils";

const ORBIT_TOOLS = [
  {
    ...MCP_TOOL_ICONS[0],
    containerClass: "h-8 w-8",
    iconClass: "h-4 w-4",
    bounceDelay: 0,
  },
  {
    ...MCP_TOOL_ICONS[1],
    containerClass: "h-12 w-12",
    iconClass: "h-6 w-6",
    bounceDelay: 0.8,
  },
  {
    ...MCP_TOOL_ICONS[2],
    containerClass: "h-16 w-16",
    iconClass: "h-8 w-8",
    bounceDelay: 1.6,
  },
  {
    ...MCP_TOOL_ICONS[3],
    containerClass: "h-12 w-12",
    iconClass: "h-6 w-6",
    bounceDelay: 2.4,
  },
  {
    ...MCP_TOOL_ICONS[4],
    containerClass: "h-8 w-8",
    iconClass: "h-4 w-4",
    bounceDelay: 3.2,
  },
] as const;

const SPARKLE_POSITIONS = [
  { id: "s-1", top: 12, left: 18, duration: 4.2, x: -0.5, y: 0.8 },
  { id: "s-2", top: 28, left: 72, duration: 5.1, x: 0.3, y: -0.4 },
  { id: "s-3", top: 44, left: 35, duration: 4.8, x: -0.8, y: 0.2 },
  { id: "s-4", top: 58, left: 88, duration: 5.6, x: 0.6, y: -0.7 },
  { id: "s-5", top: 71, left: 12, duration: 4.5, x: 0.1, y: 0.5 },
  { id: "s-6", top: 83, left: 54, duration: 5.3, x: -0.3, y: -0.2 },
  { id: "s-7", top: 22, left: 91, duration: 4.9, x: 0.7, y: 0.4 },
  { id: "s-8", top: 36, left: 48, duration: 5.8, x: -0.6, y: -0.5 },
  { id: "s-9", top: 52, left: 8, duration: 4.1, x: 0.4, y: 0.3 },
  { id: "s-10", top: 66, left: 76, duration: 5.4, x: -0.2, y: 0.6 },
  { id: "s-11", top: 79, left: 29, duration: 4.7, x: 0.5, y: -0.3 },
  { id: "s-12", top: 91, left: 63, duration: 5.2, x: -0.4, y: 0.1 },
] as const;

function subscribeToMounted() {
  return () => {};
}

function getMountedSnapshot() {
  return true;
}

function getMountedServerSnapshot() {
  return false;
}

function ToolIcon({
  className,
  src,
}: {
  className?: string;
  src: string;
}) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className={cn("object-contain dark:brightness-110", className)}
      height={32}
      src={src}
      width={32}
    />
  );
}

function OrbitContainer({
  bounceDelay,
  children,
  className,
  reduceMotion,
}: {
  bounceDelay: number;
  children: React.ReactNode;
  className?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.1, 1],
              y: [0, -4, 0],
            }
      }
      className={cn(
        "flex items-center justify-center rounded-full bg-[rgba(248,248,248,0.01)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]",
        className
      )}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
              delay: bounceDelay,
              ease: "easeInOut",
            }
      }
    >
      {children}
    </motion.div>
  );
}

function ToolOrbitSparkles({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0">
      {SPARKLE_POSITIONS.map((sparkle) => (
        <motion.span
          animate={{
            top: `calc(${sparkle.top}% + ${sparkle.y}px)`,
            left: `calc(${sparkle.left}% + ${sparkle.x}px)`,
            opacity: [0.15, 1, 0],
            scale: [1, 1.2, 0],
          }}
          className="inline-block size-0.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
          initial={{
            top: `${sparkle.top}%`,
            left: `${sparkle.left}%`,
            opacity: 0.35,
          }}
          key={sparkle.id}
          style={{ position: "absolute" }}
          transition={{
            duration: sparkle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function ToolOrbitSkeleton() {
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(
    subscribeToMounted,
    getMountedSnapshot,
    getMountedServerSnapshot
  );

  if (!mounted) {
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden p-8">
        <div className="flex shrink-0 flex-row items-center justify-center gap-2 opacity-70">
          {ORBIT_TOOLS.map((tool) => (
            <div
              className={cn(
                "flex items-center justify-center rounded-full bg-neutral-300/40 dark:bg-neutral-800/60",
                tool.containerClass
              )}
              key={tool.name}
            >
              <ToolIcon className={tool.iconClass} src={tool.src} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden p-8">
      <div className="flex shrink-0 flex-row items-center justify-center gap-2">
        {ORBIT_TOOLS.map((tool) => (
          <OrbitContainer
            bounceDelay={tool.bounceDelay}
            className={tool.containerClass}
            key={tool.name}
            reduceMotion={reduceMotion}
          >
            <ToolIcon className={tool.iconClass} src={tool.src} />
          </OrbitContainer>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-32 w-10">
          <ToolOrbitSparkles reduceMotion={reduceMotion} />
        </div>
      </div>
    </div>
  );
}

export function ToolOrbitShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-[15rem] overflow-hidden rounded-xl bg-neutral-300/70 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)] md:h-[20rem]",
        className
      )}
    >
      <ToolOrbitSkeleton />
    </div>
  );
}

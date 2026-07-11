"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function TypewriterText({
  text,
  className,
  speed = 28,
  active = true,
  showCursor = true,
}: {
  text: string;
  className?: string;
  speed?: number;
  active?: boolean;
  showCursor?: boolean;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(reduce ? text : "");

  useEffect(() => {
    if (reduce || !active) {
      setDisplay(text);
      return;
    }

    setDisplay("");
    let index = 0;
    const id = setInterval(() => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(id);
      }
    }, speed);

    return () => clearInterval(id);
  }, [active, reduce, speed, text]);

  return (
    <span className={cn("whitespace-pre-wrap", className)}>
      {display}
      {showCursor && active && !reduce ? (
        <span className="terminal-cursor ml-0.5 inline-block h-[1em] w-0.5 bg-emerald-400/80 align-middle" />
      ) : null}
    </span>
  );
}

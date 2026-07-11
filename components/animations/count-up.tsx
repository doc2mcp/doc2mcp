"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  duration = 1200,
}: {
  value: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) {
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) {
          return;
        }
        started.current = true;

        const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""));
        if (Number.isNaN(numeric)) {
          setShown(value);
          return;
        }

        const prefix = value.match(/^[^\d]*/)?.[0] ?? "";
        const suffix = value.match(/[^\d.]*$/)?.[0] ?? "";
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const current = numeric * progress;
          const formatted = value.includes(".")
            ? current.toFixed(1)
            : Math.round(current).toString();
          setShown(`${prefix}${formatted}${suffix}`);
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [duration, reduce, value]);

  return <span ref={ref}>{shown}</span>;
}

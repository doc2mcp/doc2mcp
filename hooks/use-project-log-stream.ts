"use client";

import { useEffect, useRef, useState } from "react";
import type { ProcessingLog } from "@/types/platform";

type StreamPayload = {
  status: string;
  logs: ProcessingLog[];
  done: boolean;
};

export function useProjectLogStream(
  projectId: string,
  enabled: boolean,
  initialLogs: ProcessingLog[]
) {
  const [logs, setLogs] = useState<ProcessingLog[]>(initialLogs);
  const [status, setStatus] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const logsRef = useRef(initialLogs);

  useEffect(() => {
    logsRef.current = initialLogs;
    setLogs(initialLogs);
  }, [initialLogs]);

  useEffect(() => {
    if (!enabled) {
      setConnected(false);
      return;
    }

    const source = new EventSource(`/api/projects/${projectId}/stream`);

    source.onopen = () => {
      setConnected(true);
    };

    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as StreamPayload;
        setStatus(payload.status);
        if (payload.logs.length >= logsRef.current.length) {
          logsRef.current = payload.logs;
          setLogs(payload.logs);
        }
        if (payload.done) {
          source.close();
          setConnected(false);
        }
      } catch {
        /* ignore malformed frames */
      }
    };

    source.onerror = () => {
      setConnected(false);
      source.close();
    };

    return () => {
      source.close();
      setConnected(false);
    };
  }, [projectId, enabled]);

  return { logs, status, connected };
}

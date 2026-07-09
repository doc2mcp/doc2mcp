"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

export type CabinetTab = "web" | "code" | "images" | "memory";

export type WebSource = {
  title: string;
  url: string;
  snippet?: string;
};

type ChatCabinetsState = {
  open: boolean;
  tab: CabinetTab;
  webSources: WebSource[];
  setOpen: (open: boolean) => void;
  setTab: (tab: CabinetTab) => void;
  setWebSources: (sources: WebSource[]) => void;
  openCabinet: (tab?: CabinetTab) => void;
};

const ChatCabinetsContext = createContext<ChatCabinetsState | null>(null);

export function ChatCabinetsProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<CabinetTab>("web");
  const [webSources, setWebSources] = useState<WebSource[]>([]);

  const value = useMemo(
    () => ({
      open,
      tab,
      webSources,
      setOpen,
      setTab,
      setWebSources,
      openCabinet: (next?: CabinetTab) => {
        if (next) {
          setTab(next);
        }
        setOpen(true);
      },
    }),
    [open, tab, webSources]
  );

  return (
    <ChatCabinetsContext.Provider value={value}>
      {children}
    </ChatCabinetsContext.Provider>
  );
}

export function useChatCabinets() {
  const ctx = useContext(ChatCabinetsContext);
  if (!ctx) {
    throw new Error("useChatCabinets must be used within ChatCabinetsProvider");
  }
  return ctx;
}

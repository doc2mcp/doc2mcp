"use client";

import { PanelLeftIcon } from "lucide-react";
import { memo } from "react";
import { useChatCabinets } from "@/components/chat/chat-cabinets-context";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const { openCabinet, webSources } = useChatCabinets();

  if (state === "collapsed" && !isMobile) {
    return null;
  }

  return (
    <header className="sticky top-0 flex h-14 items-center gap-2 bg-sidebar px-3">
      <Button
        className="md:hidden"
        onClick={toggleSidebar}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <PanelLeftIcon className="size-4" />
      </Button>

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
        />
      )}

      <div className="ml-auto">
        <Button
          onClick={() => openCabinet("web")}
          size="sm"
          type="button"
          variant="outline"
        >
          Sources
          {webSources.length > 0 ? (
            <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 font-mono text-[10px]">
              {webSources.length}
            </span>
          ) : null}
        </Button>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});

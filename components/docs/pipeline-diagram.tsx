import Image from "next/image";
import { cn } from "@/lib/utils";

type PipelineDiagramProps = {
  className?: string;
};

/** Excalidraw-style pipeline overview used across docs. */
export function PipelineDiagram({ className }: PipelineDiagramProps) {
  return (
    <Image
      alt="The doc2mcp pipeline: Docs URL → Crawl → Analyze → MCP tools → Hosted MCP → Agents"
      className={cn("h-auto w-full rounded-lg", className)}
      height={720}
      priority={false}
      src="/diagrams/pipeline.png"
      width={1280}
    />
  );
}

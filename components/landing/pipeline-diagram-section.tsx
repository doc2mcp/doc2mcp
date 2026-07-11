import Image from "next/image";

export function PipelineDiagramSection() {
  return (
    <section className="relative py-16 sm:py-20" id="pipeline">
      <div className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,40px)]">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Image
            alt="The doc2mcp pipeline: documentation, crawling, knowledge processing, retrieval, MCP generation, AI agents"
            className="h-auto w-full"
            height={300}
            priority={false}
            src="/diagrams/pipeline.svg"
            unoptimized
            width={1280}
          />
        </div>
      </div>
    </section>
  );
}

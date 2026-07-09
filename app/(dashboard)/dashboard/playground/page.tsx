import type { Metadata } from "next";
import { auth } from "@/app/(auth)/auth";
import { PlaygroundExperience } from "@/components/playground/playground-experience";
import { getPlatformProjectsByUserId } from "@/lib/db/queries";
import type { ProjectArtifacts } from "@/types/platform";

export const metadata: Metadata = {
  title: "MCP Playground",
  description:
    "Connect your hosted documentation MCP and chat with it — ask questions, search pages, and get cited answers.",
};

export default async function DashboardPlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  const params = await searchParams;
  const projects = await getPlatformProjectsByUserId({ userId });

  const mapped = projects.map((p) => {
    const artifacts = p.artifacts as ProjectArtifacts | null;
    return {
      id: p.id,
      name: p.name ?? "",
      sourceUrl: p.sourceUrl,
      status: p.status,
      hasToken: Boolean(artifacts?.mcpAccessToken),
      pageCount: artifacts?.docsPageCount,
    };
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-muted-foreground text-xs uppercase tracking-wider">
          Sandbox
        </p>
        <h1 className="mt-1 font-display font-bold text-3xl tracking-tight">
          MCP Playground
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-relaxed">
          Add your hosted MCP, then chat with your documentation — the agent
          calls real tools and streams cited answers, just like Cursor.
        </p>
      </header>

      <PlaygroundExperience
        initialProjectId={params.project}
        projects={mapped}
      />
    </div>
  );
}

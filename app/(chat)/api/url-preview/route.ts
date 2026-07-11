import { auth } from "@/app/(auth)/auth";
import { ChatbotError } from "@/lib/errors";
import {
  fetchPageContentAsMarkdown,
  isPublicHttpUrl,
} from "@/lib/search/page-content";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url")?.trim();
  if (!rawUrl || !isPublicHttpUrl(rawUrl)) {
    return Response.json({ error: "invalid_url" }, { status: 400 });
  }

  const page = await fetchPageContentAsMarkdown(rawUrl, 16_000);
  if (!page) {
    return Response.json(
      {
        error: "fetch_failed",
        message:
          "Could not load a readable preview for this URL. It may block embedding or require login.",
        url: rawUrl,
      },
      { status: 502 }
    );
  }

  return Response.json({
    url: rawUrl,
    title: page.title,
    content: page.content,
    images: page.images,
  });
}

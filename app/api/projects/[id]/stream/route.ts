import { auth } from "@/app/(auth)/auth";
import { getPlatformProjectById } from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";
import type { ProcessingLog } from "@/types/platform";

const TERMINAL_STATUSES = new Set(["ready", "error"]);
const STREAM_POLL_INTERVAL_MS = 1200;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new ChatbotError("unauthorized:api").toResponse();
  }

  const { id } = await params;

  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: {
        status: string;
        logs: ProcessingLog[];
        done: boolean;
      }) => {
        if (closed) {
          return;
        }
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
        );
      };

      const poll = async () => {
        while (!closed) {
          try {
            const project = await getPlatformProjectById({
              id,
              userId: session.user.id,
            });

            if (!project) {
              send({ status: "not_found", logs: [], done: true });
              break;
            }

            const logs = (project.logs as ProcessingLog[] | null) ?? [];
            const done = TERMINAL_STATUSES.has(project.status);
            send({ status: project.status, logs, done });

            if (done) {
              break;
            }

            await new Promise((resolve) => {
              setTimeout(resolve, STREAM_POLL_INTERVAL_MS);
            });
          } catch {
            send({ status: "error", logs: [], done: true });
            break;
          }
        }

        if (!closed) {
          controller.close();
        }
      };

      await poll();
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

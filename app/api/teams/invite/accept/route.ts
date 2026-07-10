import { auth } from "@/app/(auth)/auth";
import { acceptTeamInviteByToken } from "@/lib/db/queries";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.type === "guest") {
    return Response.json(
      { error: "unauthorized", message: "Sign in to accept a team invite." },
      { status: 401 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { token?: string };
  const token = body.token?.trim();
  if (!token) {
    return Response.json(
      { error: "invalid_token", message: "Invite token is missing." },
      { status: 400 }
    );
  }

  const userEmail = session.user.email?.trim();
  if (!userEmail) {
    return Response.json(
      {
        error: "email_required",
        message: "Your account needs a verified email to join a team.",
      },
      { status: 400 }
    );
  }

  try {
    const { team, invite } = await acceptTeamInviteByToken({
      rawToken: token,
      userId: session.user.id,
      userEmail,
    });

    return Response.json({
      ok: true,
      team: team ? { id: team.id, name: team.name, slug: team.slug } : null,
      invite: {
        id: invite.id,
        role: invite.role,
        status: invite.status,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.startsWith("not_found")) {
      return Response.json(
        {
          error: "not_found",
          message: "This invite link is invalid or was already used.",
        },
        { status: 404 }
      );
    }
    if (message.startsWith("expired")) {
      return Response.json(
        {
          error: "expired",
          message: "This invite link has expired. Ask the owner for a new one.",
        },
        { status: 410 }
      );
    }
    if (message.startsWith("email_mismatch")) {
      return Response.json(
        {
          error: "email_mismatch",
          message:
            "Sign in with the same email address the invite was sent to.",
        },
        { status: 403 }
      );
    }
    return Response.json(
      { error: "server_error", message: "Could not accept invite." },
      { status: 500 }
    );
  }
}

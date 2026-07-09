import { auth } from "@/app/(auth)/auth";
import {
  createTeamInvite,
  getOrCreateOwnedTeam,
  listTeamInvitesForOwner,
} from "@/lib/db/queries";

/**
 * Team invites are owner-scoped only:
 * - GET lists invites for teams where session.user.id === Team.ownerId
 * - POST creates an invite only after resolving/creating the caller's owned team
 *   and re-checking ownership inside createTeamInvite()
 * Guests and unauthenticated callers get 401. Non-owners cannot target another
 * team's id — the API never accepts a client-supplied teamId.
 */
async function requireTeamOwnerSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.type === "guest") {
    return {
      error: Response.json({ error: "unauthorized" }, { status: 401 }),
    } as const;
  }
  return { session } as const;
}

export async function GET() {
  const authResult = await requireTeamOwnerSession();
  if ("error" in authResult) {
    return authResult.error;
  }
  const { session } = authResult;

  const ownedTeam = await getOrCreateOwnedTeam({
    userId: session.user.id,
    email: session.user.email,
  });
  if (!ownedTeam || ownedTeam.ownerId !== session.user.id) {
    return Response.json(
      {
        error: "forbidden",
        message: "Only the workspace owner can view invites.",
      },
      { status: 403 }
    );
  }

  const invites = await listTeamInvitesForOwner({ userId: session.user.id });

  return Response.json({
    team: {
      id: ownedTeam.id,
      name: ownedTeam.name,
      slug: ownedTeam.slug,
      ownerId: ownedTeam.ownerId,
    },
    invites: invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      role: invite.role,
      status: invite.status,
      expiresAt: invite.expiresAt,
      createdAt: invite.createdAt,
    })),
  });
}

export async function POST(request: Request) {
  const authResult = await requireTeamOwnerSession();
  if ("error" in authResult) {
    return authResult.error;
  }
  const { session } = authResult;

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    role?: "admin" | "member";
  };
  const email = body.email?.trim().toLowerCase();
  if (!email?.includes("@")) {
    return Response.json(
      { error: "invalid_email", message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const ownedTeam = await getOrCreateOwnedTeam({
    userId: session.user.id,
    email: session.user.email,
  });
  if (!ownedTeam || ownedTeam.ownerId !== session.user.id) {
    return Response.json(
      {
        error: "forbidden",
        message: "Only the workspace owner can create invites.",
      },
      { status: 403 }
    );
  }

  try {
    const { invite, rawToken } = await createTeamInvite({
      teamId: ownedTeam.id,
      email,
      invitedBy: session.user.id,
      role: body.role === "admin" ? "admin" : "member",
    });

    const origin =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
      "https://doc2mcp.site";
    const acceptUrl = `${origin}/dashboard/settings?invite=${rawToken}`;

    return Response.json({
      invite: {
        id: invite?.id,
        email: invite?.email,
        status: invite?.status,
        expiresAt: invite?.expiresAt,
      },
      acceptUrl,
      note: "Email delivery is not wired yet — share this accept link with your teammate.",
    });
  } catch {
    return Response.json(
      {
        error: "forbidden",
        message: "Only the workspace owner can create invites.",
      },
      { status: 403 }
    );
  }
}

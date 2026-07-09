import { auth } from "@/app/(auth)/auth";
import {
  createTeamInvite,
  getOrCreateOwnedTeam,
  listTeamInvitesForOwner,
} from "@/lib/db/queries";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.type === "guest") {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const team = await getOrCreateOwnedTeam({
    userId: session.user.id,
    email: session.user.email,
  });
  const invites = await listTeamInvitesForOwner({ userId: session.user.id });

  return Response.json({
    team,
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
  const session = await auth();
  if (!session?.user?.id || session.user.type === "guest") {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

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
  if (!ownedTeam) {
    return Response.json(
      { error: "team_create_failed", message: "Could not create workspace." },
      { status: 500 }
    );
  }

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
}

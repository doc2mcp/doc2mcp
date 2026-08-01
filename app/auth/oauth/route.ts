import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { startAppSession } from "@/lib/auth/start-app-session";
import { getDoc2McpBaseUrl } from "@/lib/doc2mcp/app-url";
import {
  getSupabasePublicEnv,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

function safeNext(raw: string | null): string {
  if (!raw?.startsWith("/")) {
    return "/post-login";
  }
  if (raw.startsWith("//") || raw.startsWith("/auth/")) {
    return "/post-login";
  }
  return raw;
}

function publicOrigin(request: NextRequest): string {
  if (process.env.VERCEL_ENV === "production") {
    return getDoc2McpBaseUrl();
  }
  return new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_code`);
  }

  if (!isSupabasePublicConfigured()) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=auth_not_configured`
    );
  }

  const { url, anonKey } = getSupabasePublicEnv();
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];

  // Read PKCE verifier from the incoming request cookies (not cookies()
  // after middleware mutation). Attach any Set-Cookie from the exchange
  // onto the redirect response.
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: {
          name: string;
          value: string;
          options: CookieOptions;
        }[]
      ) {
        for (const cookie of cookiesToSet) {
          pendingCookies.push(cookie);
        }
      },
    },
  });

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user?.email) {
    const message = encodeURIComponent(
      error?.message ?? "Google sign-in failed"
    );
    return NextResponse.redirect(
      `${origin}/auth/error?error=${message}&error_code=exchange_failed`
    );
  }

  const metadata = data.user.user_metadata ?? {};

  await startAppSession({
    id: data.user.id,
    email: data.user.email,
    name:
      (typeof metadata.full_name === "string" && metadata.full_name) ||
      (typeof metadata.name === "string" && metadata.name) ||
      null,
    image:
      (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
      (typeof metadata.picture === "string" && metadata.picture) ||
      null,
  });

  const response = NextResponse.redirect(`${origin}${next}`);
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set(name, value, options);
  }
  return response;
}

import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getSupabasePublicEnv,
  isSupabasePublicConfigured,
} from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

function safeRedirectUrl(raw: string | null): string | null {
  if (!raw?.startsWith("/") || raw.startsWith("//")) {
    return null;
  }
  return raw;
}

/**
 * Start Google OAuth. PKCE code-verifier cookies must be attached to the
 * redirect Response that leaves this route — using cookies().set() alone can
 * drop them when returning NextResponse.redirect(), which surfaces as
 * "PKCE code verifier not found in storage" on /auth/oauth.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const redirectUrl = safeRedirectUrl(searchParams.get("redirectUrl"));

  if (!isSupabasePublicConfigured()) {
    const message = encodeURIComponent(
      "Auth is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel, then redeploy."
    );
    return NextResponse.redirect(`${origin}/login?error=${message}`);
  }

  const next = redirectUrl
    ? `/post-login?redirectUrl=${encodeURIComponent(redirectUrl)}`
    : "/post-login";
  const redirectTo = `${origin}/auth/oauth?next=${encodeURIComponent(next)}`;

  const { url, anonKey } = getSupabasePublicEnv();
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];

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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error || !data.url) {
    const message = encodeURIComponent(
      error?.message ?? "Google sign-in failed"
    );
    return NextResponse.redirect(`${origin}/login?error=${message}`);
  }

  const response = NextResponse.redirect(data.url);
  for (const { name, value, options } of pendingCookies) {
    response.cookies.set(name, value, options);
  }
  return response;
}

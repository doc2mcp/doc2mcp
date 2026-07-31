import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { AuthAwareLandingNavigation } from "@/components/landing/auth-aware-navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";
import { CONTACT_EMAIL, GITHUB_REPO_URL, SITE_URL } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Open Source — doc2mcp",
  description:
    "Contribute to doc2mcp: good first issues, contributor coupon for free Starter, and contribution guidelines.",
  openGraph: {
    title: "Open Source — doc2mcp",
    description:
      "Build documentation infrastructure for AI agents. Issues, PRs, and a free Starter grant for contributors.",
    url: `${SITE_URL}/open-source`,
  },
};

const TRACKS: Array<{
  title: string;
  body: ReactNode;
  href: string;
  cta: string;
}> = [
  {
    title: "Good first issues",
    body: "Labeled starter tickets across frontend, CLI, docs, and a11y. Ideal for your first PR.",
    href: `${GITHUB_REPO_URL}/labels/good%20first%20issue`,
    cta: "Browse issues",
  },
  {
    title: "Larger improvements",
    body: "Ship meaningful MCP, pipeline, billing, or CLI improvements. We review every PR with CI + AI review.",
    href: `${GITHUB_REPO_URL}/issues`,
    cta: "See open issues",
  },
  {
    title: "Contributor Starter grant",
    body: (
      <>
        Redeem coupon{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          opensourcedoc2mcp
        </code>{" "}
        on Pricing or Settings — activates Starter for 12 months with no
        Razorpay checkout.
      </>
    ),
    href: "/pricing",
    cta: "Apply coupon",
  },
];

export default function OpenSourcePage() {
  return (
    <main className="landing-page relative min-h-screen overflow-x-hidden">
      <AuthAwareLandingNavigation />
      <section className="relative mx-auto max-w-3xl px-6 pt-32 pb-16 lg:px-8">
        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.18em]">
          Open source
        </p>
        <h1 className="mt-4 font-display font-bold text-4xl tracking-tight sm:text-5xl">
          Build doc2mcp with us
        </h1>
        <p className="mt-6 text-foreground/85 text-base leading-relaxed">
          doc2mcp turns any documentation URL into a hosted Model Context
          Protocol server for Cursor, Claude, and VS Code. The product repo is
          public — fork it, fix bugs, ship features, and earn a free Starter
          plan while you contribute.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <a href={GITHUB_REPO_URL} rel="noopener noreferrer" target="_blank">
              Star on GitHub
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={`${GITHUB_REPO_URL}/blob/main/CONTRIBUTING.md`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Read CONTRIBUTING
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/docs">Product docs</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-16 sm:grid-cols-3 lg:px-8">
        {TRACKS.map((track) => (
          <article
            className="rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm"
            key={track.title}
          >
            <h2 className="font-display font-semibold text-xl tracking-tight">
              {track.title}
            </h2>
            <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
              {track.body}
            </p>
            <Link
              className="mt-5 inline-flex text-sm font-medium underline-offset-4 hover:underline"
              href={track.href}
              {...(track.href.startsWith("http")
                ? { rel: "noopener noreferrer", target: "_blank" }
                : {})}
            >
              {track.cta} →
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-3xl space-y-10 px-6 pb-24 lg:px-8">
        <div>
          <h2 className="font-display font-semibold text-2xl tracking-tight">
            How to contribute
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-foreground/85 text-[15px] leading-relaxed">
            <li>
              Fork{" "}
              <a
                className="underline hover:text-foreground"
                href={GITHUB_REPO_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                github.com/doc2mcp/doc2mcp
              </a>{" "}
              and branch from <code className="font-mono text-sm">staging</code>
              .
            </li>
            <li>
              Pick an issue (prefer{" "}
              <code className="font-mono text-sm">good first issue</code> or{" "}
              <code className="font-mono text-sm">help wanted</code>).
            </li>
            <li>
              Run <code className="font-mono text-sm">pnpm check</code> and{" "}
              <code className="font-mono text-sm">pnpm exec tsc --noEmit</code>{" "}
              before opening a PR →{" "}
              <code className="font-mono text-sm">staging</code>.
            </li>
            <li>
              Follow the{" "}
              <a
                className="underline hover:text-foreground"
                href={`${GITHUB_REPO_URL}/blob/main/CODE_OF_CONDUCT.md`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Code of Conduct
              </a>
              .
            </li>
          </ol>
        </div>

        <div>
          <h2 className="font-display font-semibold text-2xl tracking-tight">
            Contributor terms
          </h2>
          <div className="mt-4 space-y-3 text-foreground/85 text-[15px] leading-relaxed">
            <p>
              By submitting a pull request, issue, or other contribution, you
              agree that your contribution is offered under the same license as
              the repository (see{" "}
              <a
                className="underline hover:text-foreground"
                href={`${GITHUB_REPO_URL}/blob/main/LICENSE`}
                rel="noopener noreferrer"
                target="_blank"
              >
                LICENSE
              </a>
              ), and that you have the right to license it.
            </p>
            <p>
              The hosted service at{" "}
              <a className="underline hover:text-foreground" href={SITE_URL}>
                doc2mcp.site
              </a>{" "}
              remains subject to our{" "}
              <Link
                className="underline hover:text-foreground"
                href="/terms-and-conditions"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                className="underline hover:text-foreground"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              . The contributor coupon grants Starter entitlements on the hosted
              product only; it is not transferable, has no cash value, and may
              be revoked for abuse.
            </p>
            <p>
              Security issues: email{" "}
              <a
                className="underline hover:text-foreground"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                {CONTACT_EMAIL}
              </a>{" "}
              or open a private advisory — do not file public issues for
              unpatched vulnerabilities. See{" "}
              <a
                className="underline hover:text-foreground"
                href={`${GITHUB_REPO_URL}/blob/main/SECURITY.md`}
                rel="noopener noreferrer"
                target="_blank"
              >
                SECURITY.md
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

# Doc2MCP — YC Pack (working)

**Date:** 2026-07-12  
**Site audited:** https://www.doc2mcp.site/  
**GitHub:** doc2mcp/doc2mcp (2★, 4 forks, ~Jul 2025/2026 vintage)  
**CLI:** `doc2mcp@0.1.23` on npm  

> Honest coaching doc. Numbers below that are not from founders are marked **[ASK]** or **unknown**.

---

# 1) PHASE 0 — Brutal audit memo (1 page)

## A) Real vs aspirational on the live site

| Claim / surface | Verdict |
| --- | --- |
| Paste docs URL → hosted MCP in seconds | **Real** — core product works (web + CLI + pipeline) |
| Cursor / Claude / VS Code connect | **Real** — install configs + `doc2mcp-server` proxy |
| Free tier + paid Razorpay plans | **Real** — Starter ₹299 / Pro ₹999 / Team ₹2,999 (also USD) |
| CLI on npm | **Real** — `doc2mcp@0.1.23` |
| Webhook sync + SSE crawl logs | **Real** (shipped recently) |
| Understanding score / semantic tools | **Real-ish** — product features exist; quality not yet public-proofed |
| Testimonial marquee (16 anonymous quotes) | **Aspirational / harmful** — no names, companies, or links → reads as fake |
| “SOC 2-ready” / “SOC 2 in progress” | **Unproven on site** — docs say scaffold; do not claim progress without auditor |
| Enterprise: VPC self-host, SAML, SIEM export, BYOK | **Roadmap theater** — docs are scaffolds (“contact for pilots”), not GA |
| Notion / Confluence connectors | **Scaffold docs**, not shipped product |
| “Enterprise-ready” section | **Overclaim** for current stage |
| GitHub social proof | **Weak** — 2 stars (public). Do not imply open-source momentum |
| Customer logos | **Absent** (good — don’t invent) |

## B) What YC partners will attack in interview

1. **“Isn’t this just a wrapper on crawl + MCP?”** — DIY scripts / open-source docs→MCP exist.  
2. **“Who pays and why not build in-house?”** — API companies already have docs teams; need budget owner.  
3. **“Show retention.”** — One-time convert ≠ habit. Weekly reconnect / tool calls matter.  
4. **“₹999 Pro / $15 feels like indie SaaS.”** — Venture story needs platform / official-MCP pricing.  
5. **“Fake social proof?”** — Anonymous testimonials destroy trust with sharp partners.  
6. **“Why you?”** — Need founder-market fit, not MCP buzzwords.  
7. **“India GTM vs US ICP.”** — Who are the first 20 design partners? US API cos vs India startups?  
8. **“What’s the moat in 18 months?”** — Hosted alone is not enough; sync + quality + distribution.

## C) Top 10 fixes by YC selection impact

1. **Kill anonymous testimonials** until you have named, permissioned quotes.  
2. **Replace enterprise/SOC2 theater** with “what works today + what’s coming.”  
3. **Pick ONE beachhead ICP** (recommendation: **API companies publishing official MCP**).  
4. **14-day proof sprint** — 20 manual design partners, not homepage polish.  
5. **Instrument funnel** — visit → MCP created → Cursor connected → D7 return → paid.  
6. **Pricing narrative** — Free/dev + **Company / Official MCP** plan (usage or seats for external agents), not only hobby caps.  
7. **Honest homepage** — outcome for API companies; proof only if real.  
8. **Founder story + why now** — crisp for app + video.  
9. **Competitive wedge on paper** — hosted remote + live sync + semantic tools + IDE distribution vs DIY.  
10. **Public proof ledger** — MCPs created, weekly active projects, npm installs (only true numbers).

## D) What NOT to change

- Core loop: URL → hosted MCP → IDE config (this is the wedge).  
- CLI + PAT device flow (developer credibility).  
- Shipping speed / product depth already in repo (don’t rewrite to “simpler chatbot”).  
- Dual INR/USD checkout for India founders — keep free + paid; **add** company tier rather than deleting INR.  
- Honest “contact for enterprise” is fine; fake GA enterprise is not.

**YC readiness now: 3/10** — real product, weak evidence, trust leaks on marketing, lifestyle pricing optics.

---

# 2) PHASE 1 — YC narrative pack (copy-paste ready)

### 1) One-liner (≤50 chars)

**Docs URL → hosted MCP for agents**  
(38 chars)

Alt: **Turn API docs into agent tools** (32)

### 2) What are you making? (≤50 words)

Doc2MCP turns any documentation site into a hosted Model Context Protocol server. Paste a docs URL; we crawl, structure, and expose semantic tools so Cursor, Claude, and other agents can answer and act from your real docs in under a minute—no local scrapers, no glue code.

(49 words)

### 3) Why now

MCP became the default way coding agents attach tools (Cursor, Claude Desktop, OpenAI Agents). API companies already maintain docs, but agents still hallucinate endpoints. The gap is not “more RAG demos”—it’s **official, hosted, syncable agent interfaces** for docs the same way companies publish OpenAPI. Timing: agent adoption in IDEs is ahead of vendors’ official MCP publishing.

### 4) Beachhead customer (ONE)

**API / platform companies that sell developer APIs** (Stripe-like, infra SDKs, B2B APIs)—docs team or DevRel owns the surface; buyers care that **customers’ agents** call the right tools.

Why not “all eng teams”: too broad; retention weaker. Why not only “AI startups”: they DIY. API companies have distribution (their docs) and budget to make agents stop opening support tickets.

### 5) Unfair advantage / founder-market fit

**[ASK — fill after founder Qs]** Draft structure:

- What you’ve shipped before (scale, systems).  
- Why docs→agents (personal pain).  
- Execution edge (how fast you ship vs OSS wrappers).  
- Access (API companies, DevRel, India+US network).

### 6) Competitors + honest wedge

| Competitor type | They do | We win (12 mo) if… |
| --- | --- | --- |
| DIY / open-source crawl→MCP | Free, flexible | Hosted remote MCP + auth + sync + IDE one-click; quality of tools |
| Generic RAG chatbots | Q&A on docs | **Tools/actions** via MCP, not only chat |
| Docs platforms (Mintlify etc.) | Host docs | We sit **on top** of their URLs as agent layer; partner not replace |
| In-house platform eng | Custom MCP | Time-to-first-MCP &lt;1 min; maintenance via webhook sync |

**Wedge sentence:** “We’re the hosted distribution layer that turns an API company’s docs into official agent infrastructure—not a one-off scraper script.”

### 7) Path to a huge company

Today: convert any docs URL → hosted MCP.  
Next: **official MCP for API vendors** (versioned, synced, analytics on agent tool use).  
Then: **marketplace / registry** of trusted API MCPs + usage billing when agents of *their customers* call tools.  
Endgame: **default agent integration surface** for software companies (docs + APIs), analogous to “how humans find APIs via docs sites.”

Not: ₹999/mo indie tool forever.

### 8) Risks that could kill us

1. MCP standard fragments or IDEs bake in first-party docs tools.  
2. Docs platforms ship native MCP and own distribution.  
3. We never get past one-shot curiosity → no retention.  
4. Tool quality too weak → agents ignore MCP.  
5. We stay lifestyle SaaS and never land paying API companies.

---

# 3) PHASE 2 — 14-day traction sprint

## Metrics to start measuring **today**

| Metric | Definition | How |
| --- | --- | --- |
| Visits | Landing uniques | Vercel Analytics / Plausible |
| MCP created | Projects reaching `ready` | DB count / admin |
| Cursor connected | First successful MCP tool list/call | MCP hit logs |
| D1 / D7 return | Same user returns to project or MCP call | Auth userId + hits |
| WAUs | Users with ≥1 MCP call in 7d | Hits |
| Paid conversion | Checkout success | Razorpay |
| MRR | Recurring | Razorpay + plan table |

**[ASK]** Paste current: signups, MCPs created (all-time / 7d), paid users, MRR, MCP call volume.

## Realistic strong-app targets (pre-seed / YC stage)

Not “unicorn metrics”—**evidence of pull**:

- 20 design-partner conversations booked  
- ≥10 API/docs teams that create MCP and connect Cursor  
- ≥5 still calling MCP in week 2  
- ≥1–3 paying or LOI / design-partner letters  
- Public proof: named quote **or** clear product usage chart (no fake logos)

## ICP list (beachhead)

Target titles: Head of DevRel, Docs lead, DX eng, Platform eng at **API companies** (auth, payments, infra, AI APIs, data APIs).  
Sources: MCP Discord, Cursor forum, Twitter/X “MCP”, HN “Show HN”, LinkedIn DevRel.

## Outreach scripts (short)

**LinkedIn / email**

> Subject: Official MCP for {Company} docs?  
>  
> Hi {Name} — we built Doc2MCP: paste your docs URL → hosted MCP Cursor/Claude can use in &lt;60s. Curious if {Company} wants agents hitting **your** docs accurately without a custom server. Happy to stand up a private pilot this week and share tool-call logs. — {You}

**Twitter/X**

> If your API docs are public but agents still invent endpoints, try Doc2MCP: URL → hosted MCP. Looking for 10 API companies as design partners this week.

**HN Show HN** (when product honest): lead with demo GIF + “what’s not ready” — YC partners read HN.

## Offer that gets YES

- **Design partner (14 days):** Free Pro/Team, white-glove convert + Cursor install, weekly call, written feedback.  
- Ask for: permissioned quote OR logo later; not payment first.  
- Success = weekly MCP tool calls from their eng team.

## Daily checklist (14 days)

| Day | Focus |
| --- | --- |
| 1 | Instrument metrics; remove fake testimonials from site |
| 2 | List 100 ICP contacts; ship honest homepage strip |
| 3–4 | 30 outreaches/day; book calls |
| 5–6 | Manual onboard 5 users (screenshare) |
| 7 | Mid-week metrics review; iterate tool quality on their docs |
| 8–10 | 30 outreaches/day; onboard to 15 total |
| 11–12 | Collect 3 written notes / 1 quote; fix top bugs |
| 13 | Record 60s YC video with real demo |
| 14 | Freeze numbers for application; write progress section |

---

# 4) PHASE 3 — Site / pricing recommendations

## Trust fixes (do immediately)

1. **Remove** anonymous testimonial marquee **or** relabel as “Example outcomes” with disclaimer — better: **delete** until named.  
2. Enterprise section: retitle to **“Coming for teams”** / only claim shipped: hosted MCP, tokens, webhook sync, private projects (Pro+).  
3. Replace “SOC 2-ready / in progress” with “Security practices we use today” (token hashing, isolation) **or** silence until auditor engaged.  
4. Proof section: only GitHub stars / npm version / “N MCPs generated” if true.

## Pricing (venture narrative, keep free)

| Tier | Role | Direction |
| --- | --- | --- |
| Free / Starter | Devs try | Keep low conversion caps |
| Pro | Indie / small team | Keep, don’t lead homepage with ₹999 |
| Team | Internal squads | OK |
| **Company / Official MCP** (new) | API vendors | $$–$$$ : external agent traffic, SLA sync, analytics, custom domain, “official” badge — **sales-assisted** |
| Enterprise | VPC/SSO | “Talk to us” only until real |

Default currency optics for **YC app**: lead with **USD Company plan** story; INR can remain for India self-serve.

## Homepage copy direction (exact)

**Hero eyebrow:** DOCS → HOSTED MCP  

**Headline:** Turn your API docs into agent infrastructure  

**Sub:** Paste a docs URL. Get a Cursor- and Claude-ready MCP server in under a minute—hosted, syncable, no local scrapers.  

**CTA:** Generate MCP | View docs  

**Not in hero:** enterprise pills, fake quotes, feature grids.

**Differentiation line (below fold):** Hosted remote MCP + webhook sync + semantic tools + one-click IDE install — vs DIY open-source scrapers.

---

# 5) PHASE 4 — YC application draft

### Company description

Doc2MCP helps API companies turn documentation into hosted MCP servers so coding agents can use their products accurately.

### Product

Users paste a documentation URL. We crawl and structure the docs, generate semantic MCP tools, and host a remote MCP endpoint with tokens and IDE install configs. CLI and webhook sync keep servers fresh when docs change.

### Progress / traction **[FILL]**

- Launched: **[ASK]**  
- Users / signups: **[ASK]**  
- MCPs created: **[ASK]**  
- Weekly active (MCP calls): **[ASK]**  
- Revenue / MRR: **[ASK]**  
- Notable: npm CLI `doc2mcp`, open GitHub repo, recent sync/SSE features  

### Revenue / growth **[FILL]**

Self-serve INR/USD via Razorpay. Growth plan: design partners → Company plan.

### Market / competition

Agents need tool interfaces; MCP is emerging standard. Competitors: DIY scripts, RAG chat, docs platforms. We focus on hosted official MCP for API docs with sync and IDE distribution.

### Unique insight

Docs sites are already the source of truth for APIs; agents still don’t get an official machine interface. The winners won’t be chat wrappers—they’ll be the **publish layer** for agent-native APIs (like OpenAPI was for humans/SDKs).

### Founders **[ASK — paste bios]**

Template: Name · role · what you built (users/scale) · why this · % equity · how long together.

### Why this team **[ASK]**

### 60s video script (unscripted tone)

> “Hey — I’m {Name}. We built Doc2MCP.  
> Problem: coding agents still invent API endpoints even when your docs are perfect.  
> Demo: I paste {docs URL}… under a minute we get a hosted MCP… I connect it in Cursor… it calls the real tools from the docs.  
> We’re onboarding API companies as design partners so their customers’ agents use official docs infrastructure—not scrapers.  
> Here’s our usage so far: {real number}. Here’s what we’re measuring next week: reconnects and weekly tool calls.  
> That’s Doc2MCP.”

### Interview: 20 questions + honest answer frames

1. What do you do? → One-liner + 15s demo mental picture.  
2. Who pays? → API company DevRel/docs; start design partners.  
3. Why now? → MCP in IDEs + agent hallucination on APIs.  
4. Why not OSS? → Hosted, sync, auth, quality, distribution.  
5. Moat? → Data on tool quality + official vendor relationships + switch cost of published MCP.  
6. Retention? → Admit one-shot risk; show D7 MCP calls plan.  
7. Competition Mintlify? → They host docs; we agent-ify any URL; partner.  
8. Why you? → **[founder]**  
9. How much revenue? → Exact number; if ~0, say so + sprint.  
10. What’s broken? → Tool quality / enterprise claims we removed.  
11. Biggest risk? → Platform ships native MCP.  
12. India? → Build from India, sell global API cos.  
13. Pricing? → Free trial → Company plan for official MCP.  
14. How did last users find you? → Truth only.  
15. What did you learn this week? → Always have one.  
16. TAM? → API companies publishing docs; bottom-up agents.  
17. Hiring? → Only if asked; focus execution.  
18. Legal/compliance? → Don’t claim SOC2 if not started.  
19. Open source? → Repo exists; stars low—don’t oversell.  
20. Ask? → Design partner intros at API cos.

### Red-flag audit of *this* draft

- Still need real traction numbers.  
- Beachhead must stay singular in interviews.  
- Do not say “SOC2” or “enterprise-ready” until true.  
- Avoid “AI infrastructure” fluff without demo.

---

# 6) PHASE 5 — Positioning upgrade

**Thesis:** Every API company’s documentation becomes agent-native infrastructure—the distribution layer for how AI agents integrate with software.

**Roadmap reverse-engineered:**

1. Best URL→MCP quality (semantic tools, scores).  
2. Official publish: custom domain, version pins, public registry.  
3. Sync + analytics (what agents call).  
4. Company billing on external agent usage.  
5. Ecosystem (SDK in docs repos — Issue #87).

**GTM:** Design partners (API DevRel) → case study → Company plan → marketplace.

---

# 7) Scores

| | Now | After honest 14-day sprint (if executed) |
| --- | --- | --- |
| Product reality | 7 | 7–8 |
| Trust / site honesty | 3 | 7 |
| Traction evidence | 2 | 6–7 |
| Narrative clarity | 4 | 8 |
| Venture-scale story | 4 | 7 |
| **Overall YC readiness** | **3/10** | **6.5–7.5/10** |

YC is still founder + evidence. Sprint matters more than new logo—but logo consistency helps professionalism.

---

# Critical questions (answer these next)

1. Who are the founders (names, % equity, how long working together)?  
2. What’s your background—what have you shipped with real users before?  
3. Why did you start Doc2MCP (specific story)?  
4. Current numbers: signups, MCPs created (lifetime + 7d), paying customers, MRR, weekly MCP tool calls?  
5. Any **named** users/companies who would take a call or give a quote?  
6. Are you applying to a specific YC batch? Deadline?  
7. Which competitor do you fear most (OSS, Mintlify, Cursor-native, other)?  
8. Will you sell primarily to US API companies, India, or both in the next 90 days?

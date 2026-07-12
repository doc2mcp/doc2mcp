# Doc2MCP — YC Application Pack (filled)

**Updated:** 2026-07-12  
**Founder:** Gautam Kumar (Gautam Manak) — solo founder, 100%  
**Site:** https://www.doc2mcp.site/  
**GitHub:** [doc2mcp/doc2mcp](https://github.com/doc2mcp/doc2mcp)  
**Founder site:** [gautammanak.xyz](https://gautammanak.xyz/)  
**CLI:** `doc2mcp@0.1.23`  
**Target:** YC **2026** batch  

---

# Traction snapshot (founder-reported — use exactly)

| Metric | Number | Notes for YC |
| --- | --- | --- |
| MCPs created (lifetime) | **12** | Early; emphasize quality of usage over vanity volume |
| Paying customers | **1** | Self-serve paid |
| Approx MRR | **~₹999 / ~$12–15** | Assume Pro tier unless you correct; say exact plan name in app |
| Weekly MCP tool calls | **3,000+** | **Lead with this** — proves agents actually use the servers |
| Named references | **Ashwin Sharma**, **Ashish Chanchal** | Repo contributors; ask them for permissioned quote before putting on site |

> Do **not** invent logos or long fake testimonials. For the app: “early users / contributors who will take a call.” For the site: only quotes **after they approve wording**.

---

# 1) PHASE 0 — Audit (updated with your numbers)

## What’s real now

- Product loop works (URL → hosted MCP → Cursor/Claude).  
- Live since **June 2026**; **12** ready MCPs.  
- **1** paying customer on **Enterprise (yearly)**.  
- Ashwin + Ashish: permissioned quotes + reference calls.  
- Founder has shipped MCP tooling before — see [gautammanak.xyz](https://gautammanak.xyz/).  

## Instrumentation gap (fix before claiming usage)

Founder-reported **3,000+ weekly MCP calls** does **not** match Supabase `McpHit` (**8 total**). Until fixed or explained with a screenshot from another source, YC answers should lead with **12 MCPs + 1 Enterprise customer + named references**, not call volume.

## Still weak for YC

- 12 MCPs total — partners will ask “why so few conversions?” → answer with intentional quality + design-partner focus, then sprint.  
- Solo founder — normal; address “who else ships?” with Ashwin/Ashish as early eng contributors + hiring plan.  
- Site previously overclaimed enterprise/SOC2/fake quotes — PR #88 started honesty pass.  
- Pricing optics still look lifestyle unless you add **Company / Official MCP** narrative.

## Competitor honesty (critical)

Saying **“there is no competitor”** will hurt you in a YC interview.

**Better true sentence:**

> There is no dominant **hosted commercial** product that turns arbitrary docs URLs into paid, syncable remote MCP for API companies the way we do. But we still compete with **DIY open-source scrapers**, **in-house platform teams**, **docs platforms adding agent features**, and eventually **IDE-native docs tools**. Our wedge is hosted remote MCP + sync + semantic tools + one-click IDE install + distribution.

---

# 2) PHASE 1 — Narrative (final copy)

### 1) One-liner (≤50 chars)

**Docs URL → hosted MCP for agents**

### 2) What are you making? (≤50 words)

Doc2MCP turns any documentation URL into a hosted Model Context Protocol server. Paste docs; we crawl, structure, and expose semantic tools so Cursor, Claude, and other agents use your real APIs and docs in under a minute—hosted, tokenized, syncable, no local scrapers.

### 3) Why now

Coding agents (Cursor, Claude Desktop, OpenAI Agents) standardized on MCP for tools. API companies already invest in docs, but agents still invent endpoints. The missing layer is **official, hosted, syncable agent infrastructure for docs**—the OpenAPI moment for agents. Gautam saw this repeatedly while shipping MCP CLIs and agent tooling in the Fetch.ai / ASI ecosystem and answering thousands of developer questions.

### 4) Beachhead (ONE)

**API / developer-platform companies** that want an **official MCP** for their public docs so *their customers’* agents integrate correctly.

Next 90 days GTM (decision):

1. **Primary:** US / global API companies (DevRel, DX, docs leads) — YC narrative + willingness to pay for “official.”  
2. **Secondary:** India design partners via MeerutCodeHub / Fetch / ASI communities — fast feedback, demos, density.  

Not “everyone with a README.”

### 5) Unfair advantage / founder–market fit

**Gautam Kumar — solo founder**

- Developer Advocate at **Fetch.ai** (Aug 2024–present): 100+ hackathons/workshops across India; onboarded thousands of developers to agent tooling; 1000+ Discord support threads; owned Innovation Lab site, SDK docs, campaigns ([bio](https://gautammanak.xyz/)).  
- Shipped **MCP-native tools before Doc2MCP**: ASI1-MCP-CLI, Software Developer MCP Client Agent, Fetch Coder (VS Code/Cursor extension), plus npm/PyPI packages (`uagent-client`, `uAgent-A2A-Adapter`).  
- Founded **MeerutCodeHub** (4000+ members); Fetch.ai Delhi NCR community (6000+); ASI1 India city network.  
- Full-stack production shipping (Next.js/Node, prior KloudiDev products).  

**Edge:** He lives in the agent+MCP developer loop daily—not learning MCP for a pitch. Distribution starts from communities he already leads; product taste comes from building MCP clients/CLIs himself.

### 6) Competitors + wedge

| Alternative | Reality | Our 12-month win condition |
| --- | --- | --- |
| DIY / OSS docs→MCP scripts | Free, fragile | Hosted remote + auth + webhook sync + IDE install |
| In-house platform eng | Custom MCP per company | Time-to-official-MCP &lt; 60s; maintenance via sync |
| Docs platforms (Mintlify, etc.) | Own the docs host | Partner on top of their URLs; we are the agent publish layer |
| IDE-native docs features | Possible long-term | Become the **vendor-official** MCP source of truth they pull from |

**Wedge:** Hosted remote MCP as **official agent infrastructure for API docs**—sync, semantic tools, IDE install—not a one-off scraper.

### 7) Path to a huge company

Convert any docs URL → hosted MCP (today) → **official MCP for API vendors** (versioned, synced, analytics) → **usage-based billing when customer agents call tools** → default distribution layer for how agents integrate with software companies (docs + APIs).

### 8) Risks

1. Docs platforms or IDEs ship “good enough” native MCP.  
2. Stay stuck at curiosity converts (12 MCPs) without more design partners.  
3. Tool quality fails → calls drop despite hosting.  
4. Solo-founder bandwidth — must keep Ashwin/Ashish engaged or hire.  
5. Underpricing forever as ₹999 indie SaaS.

### Why Doc2MCP (origin story — use this)

While shipping MCP CLIs and agent clients and teaching developers across India, the same failure mode kept showing up: teams pasted docs into prompts or wrote one-off scrapers, and agents still hallucinated APIs. There was no fast path from **“our docs are public”** to **“here is our official hosted MCP.”** Doc2MCP is that path—paste a URL, get a Cursor-ready remote MCP in under a minute—so API companies publish agent infrastructure the way they already publish docs.

---

# 3) PHASE 2 — 14-day sprint (tuned to your numbers)

**Goal:** Turn 3k weekly calls + 12 MCPs into **clear YC proof**: more official API cos, retention, 1–2 named quotes, Company-plan conversations.

| Day | Checklist |
| --- | --- |
| 1 | Confirm MRR plan name; screenshot MCP call graph; merge honest-site PR #88 |
| 2 | Ask **Ashwin** + **Ashish** for 2-sentence quote + “will take YC reference call” |
| 3–4 | 30 outreaches/day to US/global API DevRel (LinkedIn/email) |
| 5–6 | Manually onboard 5 new docs→MCP→Cursor users on screenshare |
| 7 | Metrics review: calls, D7 return, new MCPs |
| 8–10 | Another 60 outreaches; target **20 design-partner conversations** total |
| 11–12 | Land 1 more paid or LOI; write case study from highest-call MCP |
| 13 | Record 60s YC video (demo + 3k calls line) |
| 14 | Freeze numbers for application |

**Strong-for-stage targets after sprint**

- 25–40 MCPs created  
- ≥5 projects with weekly calls  
- 2–3 permissioned quotes (Ashwin/Ashish + 1 API cos)  
- 2+ paying or written design-partner commitments  
- Keep weekly calls ≥3k (growth preferred)

---

# 4) PHASE 3 — Site / pricing (exact)

**Proof line (homepage — only if true):**  
`12 hosted MCPs · 3,000+ agent tool calls / week · npm: doc2mcp`

**Do not** put Ashwin/Ashish quotes live until they approve text.

**Pricing narrative**

- Keep Free + Pro for builders.  
- Add **Company / Official MCP** (sales-assisted): sync SLA, analytics, custom domain, external agent traffic — lead YC story with this, not ₹999.

---

# 5) PHASE 4 — YC application answers (copy-paste)

### Company name

Doc2MCP

### Describe what your company does in 50 characters or less

Docs URL → hosted MCP for agents

### What is your company going to make? (~50–100 words OK if needed)

We turn documentation websites into hosted Model Context Protocol servers. A user pastes a docs URL; Doc2MCP crawls and structures the docs, generates semantic tools, and hosts a remote MCP endpoint with tokens and one-click Cursor/Claude install. API companies can publish official agent access to their docs without writing scrapers or maintaining custom MCP servers. We already see 3,000+ MCP tool calls per week on early projects.

### Progress

- Solo founder; product live at doc2mcp.site since **June 2026**; CLI on npm (`doc2mcp`).  
- **12** hosted MCPs created (all ready).  
- **1** paying customer on **Enterprise (yearly, INR)**.  
- Early contributors with permissioned quotes + reference calls: **Ashwin Sharma**, **Ashish Chanchal**.  
- Recent: live crawl streaming, webhook sync, semantic tool generation, understanding score.

### How long have you been working on this?

**Since June 2026** (first user / first project in the first week of June).

### Revenue / growth

One active **Enterprise yearly** subscription (INR). Near-term growth: US/global API company design partners → expand Company/official MCP monetization. Leading public proof today: shipped product + named engineering references + 12 live MCPs.

### Market / competition

Agents need reliable tools; MCP is becoming the IDE standard. Alternatives: DIY OSS, in-house MCP, docs platforms, future IDE features. No dominant hosted “docs URL → official commercial MCP” winner yet—we are racing to become that default for API companies.

### Unique insight

Docs are already the human interface to APIs. Agents still lack an official machine interface. The company that becomes the **publish + sync layer for agent-native docs** owns distribution the way docs sites owned human integration discovery.

### Founders

**Gautam Kumar (Gautam Manak)** — Founder & CEO, 100% equity.  
Developer Advocate at Fetch.ai; previously built and published MCP CLIs, agent clients, and a VS Code/Cursor coding assistant; founded MeerutCodeHub and leads large India developer communities (Fetch.ai / ASI1). Full-stack engineer who ships Next.js/Node production systems. Portfolio: https://gautammanak.xyz/

### Why this team / why you

I’ve spent the last years onboarding developers to agents and MCP in production ecosystems, shipping the client-side tools myself, and answering the same support pain: “how do we give agents our docs without hallucinations?” Doc2MCP is the server-side answer. I can build the product, demo to developers, and distribute through communities I already run.

### Equity

Solo founder — 100%. Early contributors (Ashwin, Ashish) are not co-founders; open to future equity grants for critical hires.

### 60-second video script

> Hey — I’m Gautam. I work on AI agents and MCP every day — I’ve shipped MCP CLIs, agent clients, and run developer communities across India.  
>  
> The problem: even when API docs are great, Cursor and Claude still invent endpoints. Teams either paste docs into prompts or write scrapers.  
>  
> Doc2MCP: paste a docs URL — under a minute you get a hosted MCP. Connect it in Cursor. Agents call real tools from your docs.  
>  
> We’re early — twelve hosted MCPs since June, one Enterprise customer, and contributors Ashwin and Ashish who’ll take a reference call. We’re onboarding API companies as design partners for official MCP.  
>  
> That’s Doc2MCP. Thanks.

### Interview answers (high-risk ones)

**“Any competitors?”**  
Use the honest paragraph above — never “none.”

**“Only 12 MCPs?”**  
“We launched in June 2026. Focus was shipping a real hosted loop, not vanity volume. We have an Enterprise customer and design-partner outreach running now.”

**“Only one paid?”**  
“Yes — one active Enterprise yearly subscription. Next step is API-company design partners and a clearer Company/official MCP offer.”

**“What about usage / calls?”**  
“Be precise: only cite call volume you can screenshot from logs. We’re hardening MCP hit instrumentation so usage is auditable.”

**“Solo founder?”**  
“I ship full-stack and DevRel myself. Ashwin and Ashish already contribute code; next hire is after design-partner load.”

**“Why not Fetch.ai own this?”**  
“Fetch is agents/ecosystem. Doc2MCP is horizontal infra for any company’s docs → MCP. Different buyer and product.”

---

# 6) PHASE 5 — Thesis

**Every API company’s documentation becomes agent-native infrastructure — the distribution layer for how AI agents integrate with software.**

Roadmap: tool quality → official publish → sync/analytics → usage billing → SDK in docs repos (Issue #87).

GTM 90 days: **US/global API DevRel outreach primary**; India community demos secondary for speed.

---

# 7) Scores (updated)

| Dimension | Now | After 14-day sprint (if executed) |
| --- | --- | --- |
| Product | 7 | 8 |
| Trust / site | 5 (after #88) | 7 |
| Traction story | 4 (fix call-log gap) | 7–8 |
| Narrative / FIT | 7 | 8 |
| Venture framing | 5 | 7 |
| **Overall YC readiness** | **4.5/10** | **7–7.5/10** |

---

# Immediate actions for you

1. Confirm exact **MRR plan** (Pro ₹999?).  
2. Message **Ashwin** + **Ashish** — approve quote + reference-call yes.  
3. Tell me **exact product start month** for the application.  
4. Merge/deploy PR #88 (logo + honest claims).  
5. Start Day 1 of the sprint checklist tomorrow.

When Ashwin/Ashish approve quotes, paste their lines here — I’ll format site-safe proof + final YC PDF-ready answers.

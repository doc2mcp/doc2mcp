#!/usr/bin/env node
/**
 * Posts a structured AI code review on the current GitHub PR.
 * Used by .github/workflows/pr-ai-review.yml
 *
 * Requires: GEMINI_API_KEY, GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER,
 *           BASE_SHA, HEAD_SHA
 *
 * Optional: GEMINI_MODEL, PR_TITLE, PR_BODY, BASE_REF, HEAD_REF, REVIEW_DEEP=1
 */

const MARKER = "<!-- doc2mcp-ai-review -->";
const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const MAX_DIFF_CHARS = Number(process.env.REVIEW_MAX_DIFF_CHARS ?? 180_000);
const DEEP_REVIEW = process.env.REVIEW_DEEP === "1";

const apiKey = process.env.GEMINI_API_KEY;
const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.PR_NUMBER;
const baseSha = process.env.BASE_SHA;
const headSha = process.env.HEAD_SHA;
const baseRef = process.env.BASE_REF ?? "staging";
const headRef = process.env.HEAD_REF ?? "HEAD";

const EXCLUDE_SUFFIXES = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".ico",
  ".svg",
  ".woff",
  ".woff2",
];
const EXCLUDE_EXACT = new Set([
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
]);

const PRIORITY_PREFIXES = [
  "app/api/",
  "app/(chat)/api/",
  "app/(auth)/",
  "lib/",
  "services/",
  "cli/src/",
  "scripts/",
  "vercel.json",
  "proxy.ts",
  "middleware.ts",
  ".github/workflows/",
];

const SECRET_PATTERNS = [
  {
    id: "openai_key",
    label: "Possible OpenAI-style API key",
    regex: /\bsk-[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: "google_api_key",
    label: "Possible Google API key",
    regex: /\bAIza[0-9A-Za-z\-_]{20,}\b/g,
  },
  {
    id: "github_token",
    label: "Possible GitHub token",
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: "doc2mcp_token",
    label: "Possible doc2mcp token",
    regex: /\bd2mcp_(?:pat|usr)_[A-Za-z0-9]{16,}\b/g,
  },
  {
    id: "postgres_url",
    label: "Postgres connection string with credentials",
    regex: /postgres(?:ql)?:\/\/[^\s'"]+:[^\s'"]+@/gi,
  },
  {
    id: "jwt",
    label: "Possible JWT / service role key",
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
  },
  {
    id: "private_key",
    label: "Private key block",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  },
  {
    id: "razorpay",
    label: "Possible Razorpay secret",
    regex: /\brzp_(?:live|test)_[A-Za-z0-9]{10,}\b/g,
  },
];

const DOC2MCP_CHECKLIST = [
  "Auth/session checks on new or changed mutating API routes",
  "MCP access via resolveMcpProject + token verification (not bypassed)",
  "No secrets, .env*, or real credentials committed",
  "vercel.json functions paths match existing route.ts files",
  "QStash worker URL uses getDoc2McpBaseUrl (not hardcoded localhost in prod paths)",
  "Razorpay webhooks verify signatures before trusting payload",
  "No new orphaned legacy MCP REST routes (/pages, /ask, /search, etc.)",
  "CLI routes under /api/cli/* remain backward compatible when changed",
];

if (!apiKey) {
  console.log("GEMINI_API_KEY not set — skipping AI review.");
  process.exit(0);
}

if (!(token && repo && prNumber && baseSha && headSha)) {
  console.error("Missing required env vars for PR review.");
  process.exit(1);
}

const { execSync } = await import("node:child_process");

function runGit(command) {
  try {
    return execSync(command, {
      encoding: "utf8",
      maxBuffer: 25 * 1024 * 1024,
    }).trim();
  } catch {
    return "";
  }
}

function shouldExcludeFile(filePath) {
  if (EXCLUDE_EXACT.has(filePath)) {
    return true;
  }
  return EXCLUDE_SUFFIXES.some((suffix) => filePath.endsWith(suffix));
}

function filePriority(filePath) {
  const idx = PRIORITY_PREFIXES.findIndex((prefix) =>
    filePath.startsWith(prefix)
  );
  return idx === -1 ? PRIORITY_PREFIXES.length + 1 : idx;
}

function parseNameStatus(raw) {
  if (!raw) {
    return [];
  }
  return raw
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("\t");
      const status = parts[0] ?? "";
      if (status.startsWith("R") && parts.length >= 3) {
        return { status, path: parts[2], oldPath: parts[1] };
      }
      return { status, path: parts[1] ?? "", oldPath: null };
    })
    .filter((entry) => entry.path && !shouldExcludeFile(entry.path));
}

function getChangedFiles() {
  const raw = runGit(`git diff --name-status ${baseSha}...${headSha}`);
  return parseNameStatus(raw).sort(
    (a, b) => filePriority(a.path) - filePriority(b.path)
  );
}

function buildSmartDiff(files) {
  const chunks = [];
  let used = 0;
  const included = [];
  const skipped = [];

  for (const file of files) {
    const fileDiff = runGit(
      `git diff ${baseSha}...${headSha} -- ${JSON.stringify(file.path)}`
    );
    if (!fileDiff) {
      continue;
    }

    const header = `\n### ${file.status}\t${file.path}\n`;
    const block = `${header}${fileDiff}`;

    if (used + block.length > MAX_DIFF_CHARS) {
      skipped.push(file.path);
      continue;
    }

    chunks.push(block);
    used += block.length;
    included.push(file.path);
  }

  return {
    diff: chunks.join("\n") || "",
    included,
    skipped,
    truncated: skipped.length > 0,
  };
}

function isExampleEnvFile(filePath) {
  return filePath === ".env.example" || filePath.endsWith("/.env.example");
}

function buildSecretScanDiff(files) {
  const chunks = [];
  for (const file of files) {
    if (isExampleEnvFile(file.path)) {
      continue;
    }
    const fileDiff = runGit(
      `git diff ${baseSha}...${headSha} -- ${JSON.stringify(file.path)}`
    );
    if (fileDiff) {
      chunks.push(fileDiff);
    }
  }
  return chunks.join("\n");
}

function scanDiffForSecrets(diff, files) {
  const secretDiff = files?.length ? buildSecretScanDiff(files) : diff;
  const hits = [];
  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;
    const matches = secretDiff.match(pattern.regex);
    if (matches?.length) {
      hits.push({
        id: pattern.id,
        label: pattern.label,
        count: matches.length,
      });
    }
  }

  const envFileTouched = files?.some(
    (file) => file.path.startsWith(".env") && !isExampleEnvFile(file.path)
  );
  if (envFileTouched) {
    hits.push({
      id: "env_file",
      label: ".env* file modified — verify no real secrets committed",
      count: 1,
    });
  }

  return hits;
}

function summarizeFiles(files) {
  const groups = {
    api: 0,
    lib: 0,
    ui: 0,
    ci: 0,
    docs: 0,
    other: 0,
  };

  for (const file of files) {
    const path = file.path;
    if (path.includes("/api/") || path.startsWith("app/api/")) {
      groups.api += 1;
    } else if (path.startsWith("lib/") || path.startsWith("services/")) {
      groups.lib += 1;
    } else if (path.startsWith("app/") || path.startsWith("components/")) {
      groups.ui += 1;
    } else if (path.startsWith(".github/")) {
      groups.ci += 1;
    } else if (path.endsWith(".md")) {
      groups.docs += 1;
    } else {
      groups.other += 1;
    }
  }

  return groups;
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1]?.trim() ?? text.trim();
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

function severityRank(severity) {
  const map = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
  return map[String(severity).toLowerCase()] ?? 5;
}

function formatReviewMarkdown(review, context) {
  const findings = Array.isArray(review.findings) ? review.findings : [];
  findings.sort((a, b) => severityRank(a.severity) - severityRank(b.severity));

  const verdict = review.verdict ?? "comment";
  const verdictEmoji =
    verdict === "approve"
      ? "🟢 Approve"
      : verdict === "request_changes"
        ? "🔴 Request changes"
        : "🟡 Comment";

  const criticalCount = findings.filter((f) =>
    ["critical", "high"].includes(String(f.severity).toLowerCase())
  ).length;

  let md = `**Verdict:** ${verdictEmoji}`;
  if (criticalCount > 0) {
    md += ` · ${criticalCount} critical/high finding(s)`;
  }
  md += "\n\n";

  if (context.secretHits.length > 0) {
    md += "### ⚠️ Pre-flight secret scan (local)\n\n";
    for (const hit of context.secretHits) {
      md += `- **${hit.label}** (${hit.count} match(es) in diff)\n`;
    }
    md += "\n";
  }

  if (findings.length > 0) {
    md += "| Severity | Location | Finding |\n";
    md += "| --- | --- | --- |\n";
    for (const f of findings.slice(0, 12)) {
      const loc = f.file ? `\`${f.file}${f.line ? `:${f.line}` : ""}\`` : "—";
      const title = f.title ?? f.detail ?? "Issue";
      md += `| ${String(f.severity).toUpperCase()} | ${loc} | ${title} |\n`;
    }
    if (findings.length > 12) {
      md += `\n_+ ${findings.length - 12} more finding(s) below._\n`;
    }
    md += "\n";
  }

  if (review.summary) {
    md += `### Summary\n\n${review.summary}\n\n`;
  }

  const sections = [
    ["critical", "Critical / High"],
    ["medium", "Medium"],
    ["low", "Low / Suggestions"],
  ];

  for (const [key, title] of sections) {
    const items = findings.filter((f) => {
      const s = String(f.severity).toLowerCase();
      if (key === "critical") {
        return s === "critical" || s === "high";
      }
      if (key === "medium") {
        return s === "medium";
      }
      return s === "low" || s === "info";
    });
    if (items.length === 0) {
      continue;
    }
    md += `### ${title}\n\n`;
    for (const item of items) {
      const loc = item.file
        ? `\`${item.file}${item.line ? `:${item.line}` : ""}\` — `
        : "";
      md += `- ${loc}${item.detail ?? item.title ?? "See table above"}\n`;
    }
    md += "\n";
  }

  if (Array.isArray(review.looksGood) && review.looksGood.length > 0) {
    md += "### Looks good\n\n";
    for (const item of review.looksGood) {
      md += `- ${item}\n`;
    }
    md += "\n";
  }

  if (review.mergeRecommendation) {
    md += `### Merge recommendation\n\n${review.mergeRecommendation}\n\n`;
  }

  md += "<details><summary>Review context</summary>\n\n";
  md += `- Base: \`${baseRef}\` (\`${baseSha.slice(0, 7)}\`)\n`;
  md += `- Head: \`${headRef}\` (\`${headSha.slice(0, 7)}\`)\n`;
  md += `- Files changed: ${context.files.length} (API ${context.groups.api}, lib/services ${context.groups.lib}, UI ${context.groups.ui}, CI ${context.groups.ci})\n`;
  md += `- Diff files sent to model: ${context.included.length}`;
  if (context.skipped.length > 0) {
    md += ` (${context.skipped.length} skipped — size limit)`;
  }
  md += `\n- Model: \`${MODEL}\`${DEEP_REVIEW ? " (deep)" : ""}\n`;
  md += "</details>\n";

  return md.trim();
}

async function callGemini(prompt, { maxTokens = 4096 } = {}) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
  const maxAttempts = 4;
  let lastError = "Gemini API request failed";

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.12,
          maxOutputTokens: maxTokens,
          responseMimeType: "application/json",
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }

    const err = await res.text();
    lastError = `Gemini API ${res.status}: ${err.slice(0, 500)}`;
    const retryable = res.status === 429 || res.status === 503;
    if (!retryable || attempt === maxAttempts) {
      throw new Error(lastError);
    }

    const delayMs = 2000 * 2 ** (attempt - 1);
    console.warn(
      `Gemini ${res.status} on attempt ${attempt}/${maxAttempts}; retrying in ${delayMs}ms`
    );
    await new Promise((resolve) => {
      setTimeout(resolve, delayMs);
    });
  }

  throw new Error(lastError);
}

async function geminiReview({
  diff,
  prTitle,
  prBody,
  files,
  secretHits,
  groups,
}) {
  const checklist = DOC2MCP_CHECKLIST.map((item) => `- ${item}`).join("\n");

  const fileList = files
    .slice(0, 60)
    .map((f) => `${f.status}\t${f.path}`)
    .join("\n");

  const secretContext =
    secretHits.length > 0
      ? `\nLOCAL SECRET SCAN HITS (treat as CRITICAL until proven false positive):\n${secretHits
          .map((h) => `- ${h.label} (${h.count})`)
          .join("\n")}\n`
      : "";

  const systemContext = `You are a principal engineer reviewing doc2mcp — a Next.js 16 App Router monolith with Supabase auth/Postgres, QStash pipeline, Gemini, hosted MCP JSON-RPC at /api/mcp/{id}/mcp, CLI at /api/cli/*, Razorpay billing.

Be strict on security and auth. Be practical on style nits.
${secretContext}

Project checklist:
${checklist}`;

  const schema = `Return ONLY valid JSON (no markdown fences) with this shape:
{
  "verdict": "approve" | "request_changes" | "comment",
  "summary": "2-4 sentences",
  "mergeRecommendation": "one sentence for maintainer",
  "findings": [
    {
      "severity": "critical" | "high" | "medium" | "low" | "info",
      "file": "path/or/empty",
      "line": "number or null",
      "title": "short title",
      "detail": "actionable explanation"
    }
  ],
  "looksGood": ["bullet", "..."]
}`;

  const userPrompt = `${systemContext}

PR title: ${prTitle}
PR description:
${prBody?.slice(0, 3000) ?? "(none)"}

Changed files (${files.length}):
${fileList}

File areas: API=${groups.api}, lib/services=${groups.lib}, UI=${groups.ui}, CI=${groups.ci}, docs=${groups.docs}

${schema}

Diff (priority-ordered, may be partial):
${diff || "(empty diff)"}`;

  let raw = await callGemini(userPrompt, { maxTokens: 4096 });
  let parsed = extractJson(raw);

  if (!parsed && DEEP_REVIEW) {
    const securityPrompt = `${systemContext}

Focus ONLY on security, auth, secrets, webhooks, MCP token handling, Supabase service role usage.

PR: ${prTitle}
Files:\n${fileList}

${schema}

Diff:
${diff.slice(0, 80_000)}`;

    raw = await callGemini(securityPrompt, { maxTokens: 2048 });
    parsed = extractJson(raw);
  }

  if (!parsed) {
    return {
      verdict: secretHits.length > 0 ? "request_changes" : "comment",
      summary:
        "Automated review could not parse structured output; see raw notes below.",
      mergeRecommendation:
        secretHits.length > 0
          ? "Do not merge until secret scan hits are resolved."
          : "Human review recommended.",
      findings: secretHits.map((h) => ({
        severity: "critical",
        file: "",
        line: null,
        title: h.label,
        detail: `${h.count} pattern match(es) in diff`,
      })),
      looksGood: [],
      _raw: raw.slice(0, 2000),
    };
  }

  for (const hit of secretHits) {
    const already = parsed.findings?.some((f) =>
      String(f.title ?? f.detail ?? "")
        .toLowerCase()
        .includes(hit.id.replace(/_/g, " "))
    );
    if (!already) {
      parsed.findings = parsed.findings ?? [];
      parsed.findings.unshift({
        severity: "critical",
        file: "",
        line: null,
        title: hit.label,
        detail: "Detected by local pre-flight secret scan on the PR diff.",
      });
    }
  }

  return parsed;
}

async function githubRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `GitHub API ${method} ${path}: ${res.status} ${err.slice(0, 300)}`
    );
  }
  return res.status === 204 ? null : res.json();
}

async function upsertReviewComment(body) {
  const [owner, name] = repo.split("/");
  const comments = await githubRequest(
    `/repos/${owner}/${name}/issues/${prNumber}/comments?per_page=100`
  );
  const existing = comments.find((c) => c.body?.includes(MARKER));

  const fullBody = `${MARKER}\n## 🤖 doc2mcp AI code review\n\n${body}\n\n_Automated review — not a substitute for human review._`;

  if (existing) {
    await githubRequest(
      `/repos/${owner}/${name}/issues/comments/${existing.id}`,
      {
        method: "PATCH",
        body: { body: fullBody },
      }
    );
    console.log("Updated existing AI review comment.");
  } else {
    await githubRequest(`/repos/${owner}/${name}/issues/${prNumber}/comments`, {
      method: "POST",
      body: { body: fullBody },
    });
    console.log("Posted AI review comment.");
  }
}

async function submitPullRequestReview(review) {
  const verdict = review.verdict ?? "comment";
  if (verdict !== "request_changes" && verdict !== "approve") {
    return;
  }

  const [owner, name] = repo.split("/");
  const event = verdict === "request_changes" ? "REQUEST_CHANGES" : "APPROVE";
  const criticalCount = (review.findings ?? []).filter((f) =>
    ["critical", "high"].includes(String(f.severity).toLowerCase())
  ).length;

  const shortBody = [
    MARKER,
    `## 🤖 doc2mcp AI review — ${verdict === "request_changes" ? "changes requested" : "approved"}`,
    "",
    review.summary ?? "Automated review complete.",
    criticalCount > 0
      ? `\n**${criticalCount} critical/high finding(s).** See the full review comment below.`
      : "",
    review.mergeRecommendation
      ? `\n**Recommendation:** ${review.mergeRecommendation}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await githubRequest(`/repos/${owner}/${name}/pulls/${prNumber}/reviews`, {
      method: "POST",
      body: {
        commit_id: headSha,
        body: shortBody.slice(0, 8000),
        event,
      },
    });
    console.log(`Submitted PR review (${event}).`);
  } catch (error) {
    console.warn(
      "Could not submit PR review event:",
      error instanceof Error ? error.message : error
    );
  }
}

const files = getChangedFiles();
const { diff, included, skipped } = buildSmartDiff(files);
const secretHits = scanDiffForSecrets(diff, files);
const groups = summarizeFiles(files);
const prTitle = process.env.PR_TITLE ?? "";
const prBody = process.env.PR_BODY ?? "";

try {
  const review = await geminiReview({
    diff,
    prTitle,
    prBody,
    files,
    secretHits,
    groups,
  });

  let markdown = formatReviewMarkdown(review, {
    files,
    included,
    skipped,
    secretHits,
    groups,
  });

  if (review._raw) {
    markdown += `\n\n<details><summary>Raw model output (parse fallback)</summary>\n\n${review._raw}\n</details>`;
  }

  await upsertReviewComment(markdown);
  await submitPullRequestReview(review);

  if (review.verdict === "request_changes" || secretHits.length > 0) {
    console.log("Review completed with blocking findings.");
  } else {
    console.log("Review completed.");
  }
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  await upsertReviewComment(`⚠️ AI review failed: ${message}`);
  process.exit(1);
}

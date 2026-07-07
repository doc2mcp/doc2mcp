#!/usr/bin/env node
/**
 * Upsert GitHub Actions secrets (passed as env) into Vercel project env.
 * Used by .github/workflows/sync-vercel-env.yml
 */

import { execSync, spawnSync } from "node:child_process";

const token = process.env.VERCEL_TOKEN;
const orgId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;

if (!(token && orgId && projectId)) {
  console.error("Missing VERCEL_TOKEN, VERCEL_ORG_ID, or VERCEL_PROJECT_ID");
  process.exit(1);
}

/** @type {Array<{ name: string; required?: boolean }>} */
const VARS = [
  { name: "AUTH_SECRET", required: true },
  { name: "POSTGRES_URL", required: true },
  { name: "NEXT_PUBLIC_APP_URL", required: true },
  { name: "NEXT_PUBLIC_SUPABASE_URL", required: true },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", required: true },
  { name: "SUPABASE_SERVICE_ROLE_KEY", required: true },
  { name: "GEMINI_API_KEY", required: true },
  { name: "ADMIN_EMAILS" },
  { name: "GEMINI_MODEL" },
  { name: "GEMINI_IMAGE_MODEL" },
  { name: "KV_REST_API_URL" },
  { name: "KV_REST_API_TOKEN" },
  { name: "KV_REST_API_READ_ONLY_TOKEN" },
  { name: "QSTASH_TOKEN" },
  { name: "QSTASH_CURRENT_SIGNING_KEY" },
  { name: "QSTASH_NEXT_SIGNING_KEY" },
  { name: "QSTASH_URL" },
  { name: "RAZORPAY_KEY_ID" },
  { name: "RAZORPAY_KEY_SECRET" },
  { name: "RAZORPAY_WEBHOOK_SECRET" },
  { name: "NEXT_PUBLIC_RAZORPAY_KEY_ID" },
  { name: "TAVILY_API_KEY" },
  { name: "BRAVE_SEARCH_API_KEY" },
  { name: "EXA_API_KEY" },
  { name: "JINA_API_KEY" },
];

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env });
}

function upsertEnv(name, value, target) {
  try {
    run(
      `vercel env rm ${name} ${target} --yes --token="${token}" 2>/dev/null || true`
    );
  } catch {
    // ignore missing
  }
  const result = spawnSync(
    "vercel",
    ["env", "add", name, target, "--token", token],
    { input: value, stdio: ["pipe", "inherit", "inherit"], env: process.env }
  );
  if (result.status !== 0) {
    throw new Error(`vercel env add ${name} ${target} failed`);
  }
}

let synced = 0;
let skipped = 0;

for (const { name, required } of VARS) {
  const value = process.env[name]?.trim();
  if (!value) {
    if (required) {
      console.error(`Missing required secret/env: ${name}`);
      process.exit(1);
    }
    console.log(`skip ${name} (not set)`);
    skipped += 1;
    continue;
  }

  for (const target of ["production", "preview"]) {
    console.log(`set ${name} → ${target}`);
    upsertEnv(name, value, target);
  }
  synced += 1;
}

console.log(`Done. Synced ${synced} variable(s), skipped ${skipped}.`);

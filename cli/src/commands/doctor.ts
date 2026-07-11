import { execSync } from "node:child_process";
import pc from "picocolors";
import { getApiUrl } from "../config.js";
import { loadConfig } from "../store.js";

function checkNode(): { ok: boolean; detail: string } {
  const version = process.version;
  const major = Number.parseInt(version.slice(1), 10);
  return {
    ok: major >= 18,
    detail: `Node ${version} (need 18+)`,
  };
}

function checkPath(): { ok: boolean; detail: string } {
  try {
    execSync("which doc2mcp", { stdio: "ignore" });
    return { ok: true, detail: "doc2mcp on PATH" };
  } catch {
    return {
      ok: false,
      detail: "doc2mcp not on PATH — run: export PATH=\"$(npm prefix -g)/bin:$PATH\"",
    };
  }
}

export async function runDoctor(): Promise<void> {
  process.stdout.write(`${pc.bold("doc2mcp doctor")}\n\n`);

  const node = checkNode();
  process.stdout.write(
    `${node.ok ? pc.green("✓") : pc.red("✗")} ${node.detail}\n`
  );

  const pathCheck = checkPath();
  process.stdout.write(
    `${pathCheck.ok ? pc.green("✓") : pc.yellow("!")} ${pathCheck.detail}\n`
  );

  const config = await loadConfig();
  const apiUrl = config.apiUrl || getApiUrl();
  process.stdout.write(`${pc.green("✓")} API URL: ${apiUrl}\n`);

  if (config.token) {
    process.stdout.write(`${pc.green("✓")} CLI token stored\n`);
  } else {
    process.stdout.write(
      `${pc.yellow("!")} Not logged in — run: ${pc.bold("doc2mcp login")}\n`
    );
  }

  try {
    const res = await fetch(`${apiUrl}/api/auth/me`, {
      headers: config.token
        ? { Authorization: `Bearer ${config.token}` }
        : undefined,
    });
    process.stdout.write(
      `${res.ok ? pc.green("✓") : pc.yellow("!")} API reachable (${res.status})\n`
    );
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Network request failed";
    process.stdout.write(
      `${pc.red("✗")} Cannot reach API at ${apiUrl} (${detail})\n`
    );
  }

  process.stdout.write(`\n${pc.dim("Need help? https://doc2mcp.site/docs/cli")}\n`);
}

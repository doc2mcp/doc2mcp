"use client";

import type { HTMLAttributes, ReactNode } from "react";
import type { BundledLanguage } from "shiki";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@/components/ai-elements/code-block";

function inferLanguage(className?: string): BundledLanguage {
  const match = className?.match(/language-([\w+#.-]+)/);
  const lang = match?.[1]?.toLowerCase();
  if (!lang) {
    return "txt" as BundledLanguage;
  }
  if (lang === "py") {
    return "python";
  }
  if (lang === "js") {
    return "javascript";
  }
  if (lang === "ts") {
    return "typescript";
  }
  if (lang === "sh" || lang === "shell") {
    return "bash";
  }
  return lang as BundledLanguage;
}

function extractCode(children: ReactNode): string {
  if (typeof children === "string") {
    return children.replace(/\n$/, "");
  }
  if (Array.isArray(children)) {
    return children.map((child) => extractCode(child)).join("");
  }
  if (
    children &&
    typeof children === "object" &&
    "props" in children &&
    children.props
  ) {
    const props = children.props as { children?: ReactNode };
    return extractCode(props.children ?? "");
  }
  return "";
}

function filenameFromMeta(meta?: string): string | null {
  if (!meta?.trim()) {
    return null;
  }
  const titleMatch = meta.match(/title[=:]\s*"?([^"\s]+)"?/i);
  if (titleMatch?.[1]) {
    return titleMatch[1];
  }
  const first = meta.trim().split(/\s+/)[0];
  if (first.includes(".")) {
    return first;
  }
  return null;
}

function inferFilename(language: string, meta?: string): string | null {
  const fromMeta = filenameFromMeta(meta);
  if (fromMeta) {
    return fromMeta;
  }
  const map: Record<string, string> = {
    python: "example.py",
    javascript: "example.js",
    typescript: "example.ts",
    bash: "script.sh",
    json: "config.json",
    yaml: "config.yaml",
    rust: "main.rs",
    go: "main.go",
  };
  return map[language] ?? null;
}

export function DocPre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  const child = Array.isArray(children) ? children[0] : children;
  if (
    !child ||
    typeof child !== "object" ||
    !("props" in child) ||
    !child.props
  ) {
    return <pre {...props}>{children}</pre>;
  }

  const codeProps = child.props as {
    className?: string;
    children?: ReactNode;
    metastring?: string;
    "data-meta"?: string;
  };
  const meta = codeProps.metastring ?? codeProps["data-meta"];
  const code = extractCode(codeProps.children);
  const language = inferLanguage(codeProps.className);
  const filename = inferFilename(language, meta);

  if (!code.trim()) {
    return <pre {...props}>{children}</pre>;
  }

  return (
    <div className="my-6 not-prose">
      <CodeBlock
        className="overflow-hidden rounded-xl border border-border/50 bg-[#f4f4f5] shadow-sm dark:bg-[#18181b]"
        code={code}
        language={language}
        showLineNumbers={code.split("\n").length > 8}
      >
        <CodeBlockHeader className="border-border/40 bg-[#ececee] dark:bg-[#27272a]">
          <CodeBlockTitle>
            {filename ? (
              <CodeBlockFilename>{filename}</CodeBlockFilename>
            ) : (
              <CodeBlockFilename>{language}</CodeBlockFilename>
            )}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton />
          </CodeBlockActions>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  );
}

import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, extname, join, relative, resolve } from "node:path";

const ROOT = process.cwd();
const SKIP_DIRECTORIES = new Set([".git", ".sam", "node_modules"]);
const MARKDOWN_LINK = /!?\[[^\]]*\]\(([^)]+)\)/g;

async function collectMarkdownFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) continue;

    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(path)));
    } else if (extname(entry.name).toLowerCase() === ".md") {
      files.push(path);
    }
  }
  return files;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function normalizeTarget(rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/g, "");
  const pathOnly = target.split("#", 1)[0].split("?", 1)[0];
  return decodeURIComponent(pathOnly);
}

function isExternalOrAnchor(target) {
  return /^(?:https?:|mailto:|tel:|data:|#)/i.test(target);
}

// Docsify renders these on every page. With relativePath:true (see
// index.html), a non-rooted link in them resolves against the *currently
// displayed route*, not against this file's own location — so a link like
// "docs/foo.md" 404s once you're already on another nested docs page (path
// segment doubles). Root-relative links ("/docs/foo.md") always resolve
// correctly regardless of the current route.
const GLOBAL_NAV_FILES = new Set(["_sidebar.md", "_navbar.md"]);

const failures = [];
const markdownFiles = await collectMarkdownFiles(ROOT);

for (const file of markdownFiles) {
  const isGlobalNav = GLOBAL_NAV_FILES.has(relative(ROOT, file));
  const content = await readFile(file, "utf8");
  for (const match of content.matchAll(MARKDOWN_LINK)) {
    const rawTarget = match[1];
    if (isExternalOrAnchor(rawTarget)) continue;
    if (/^javascript:/i.test(rawTarget)) {
      failures.push(`${relative(ROOT, file)}: unsafe link ${rawTarget}`);
      continue;
    }

    const target = normalizeTarget(rawTarget);
    if (!target || target === "/") continue;

    if (isGlobalNav && !target.startsWith("/")) {
      failures.push(
        `${relative(ROOT, file)}: non-rooted link ${rawTarget} will 404 when navigating from a nested page (relativePath:true) - prefix it with "/"`,
      );
      continue;
    }

    const resolvedTarget = target.startsWith("/")
      ? resolve(ROOT, target.slice(1))
      : resolve(dirname(file), target);
    if (!(await exists(resolvedTarget))) {
      failures.push(
        `${relative(ROOT, file)}: missing local target ${rawTarget}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${markdownFiles.length} Markdown files: local links resolve.`,
  );
}

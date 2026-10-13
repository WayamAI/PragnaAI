/// <reference types="node" />
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navGroups, navItems, findNav } from "@/components/layout/nav";
import { severityTone } from "@/lib/severity";
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from "@/components/theme/theme";

const src = join(process.cwd(), "src");
const read = (p: string) => readFileSync(join(src, p), "utf8");

describe("login contract", () => {
  const login = read("routes/login.tsx");

  it("keeps the #email and #password ids with matching labels", () => {
    expect(login).toMatch(/htmlFor="email"/);
    expect(login).toMatch(/id="email"/);
    expect(login).toMatch(/htmlFor="password"/);
    expect(login).toMatch(/id="password"/);
    expect(login).toMatch(/>\s*Email\s*</);
    expect(login).toMatch(/>\s*Password\s*</);
  });

  it("keeps the Sign in heading, button and empty-field message", () => {
    expect(login).toMatch(/<h1[^>]*>\s*Sign in\s*<\/h1>/);
    expect(login).toMatch(/type="submit"[\s\S]*?Sign in\s*<\/button>/);
    expect(login).toContain("Enter any email and password to continue.");
  });
});

describe("route list", () => {
  const files = readdirSync(join(src, "routes"))
    .filter((f) => f.endsWith(".tsx") && f !== "__root.tsx")
    .map((f) => f.replace(/\.tsx$/, ""))
    .sort();

  const expected = [
    "ai-analysis",
    "documents",
    "hierarchy",
    "index",
    "integrations",
    "knowledge-base",
    "login",
    "overview",
    "reports",
    "risk-register",
    "traceability",
    "workspace",
  ];

  it("has exactly the expected route files", () => {
    expect(files).toEqual(expected);
  });

  it("registers every route path in the generated route tree", () => {
    const tree = read("routeTree.gen.ts");
    for (const name of expected.filter((n) => n !== "index")) {
      expect(tree).toContain(`path: '/${name}'`);
    }
    expect(tree).toContain("path: '/'");
  });

  it("redirects / to /overview", () => {
    expect(read("routes/index.tsx")).toContain('redirect({ to: "/overview" })');
  });
});

describe("severity mapping", () => {
  it("maps critical to error, high to warning, medium to info, low to neutral", () => {
    expect(severityTone).toEqual({
      Critical: "error",
      High: "warning",
      Medium: "info",
      Low: "neutral",
    });
  });
});

describe("theme", () => {
  it("defaults to light and reads the pragnaai-theme key before first paint", () => {
    expect(THEME_STORAGE_KEY).toBe("pragnaai-theme");
    expect(THEME_INIT_SCRIPT).toContain('localStorage.getItem("pragnaai-theme")');
    expect(THEME_INIT_SCRIPT).toContain('t==="dark"?"dark":"light"');
  });
});

describe("navigation", () => {
  it("keeps the same 10 items and urls in order, in the approved groups", () => {
    expect(navItems.map((i) => i.url)).toEqual([
      "/overview",
      "/hierarchy",
      "/workspace",
      "/ai-analysis",
      "/risk-register",
      "/traceability",
      "/knowledge-base",
      "/documents",
      "/integrations",
      "/reports",
    ]);
    expect(navGroups.map((g) => [g.label, g.items.length])).toEqual([
      ["Project", 2],
      ["Analysis", 4],
      ["Knowledge", 2],
      ["Delivery", 2],
    ]);
  });

  it("derives the group and title from the pathname, with / as Overview", () => {
    expect(findNav("/")?.item.title).toBe("Project Overview");
    expect(findNav("/risk-register")).toMatchObject({ group: "Analysis" });
    expect(findNav("/nope")).toBeUndefined();
  });
});

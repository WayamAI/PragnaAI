/// <reference types="node" />
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KpiTile, Unit } from "@/components/ui/primitives";
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

describe("risk badge", () => {
  const badgeClass: Record<string, string> = {
    error: "bg-error-badge",
    warning: "bg-warning-badge",
    info: "bg-info-badge",
    neutral: "bg-neutral-badge",
  };
  const bands: [number, number | undefined][] = [
    [250, 5], // RPN >= 200
    [120, 9], // S >= 9 and RPN >= 100
    [150, 5], // High
    [60, 5], // Medium
    [10, 3], // Low
  ];

  it("renders the tone that severityTone gives badgeForRpn for every RPN band", () => {
    for (const [rpn, s] of bands) {
      const level = badgeForRpn(rpn, s);
      const html = renderToStaticMarkup(createElement(RiskBadge, { level }));
      expect(html).toContain(badgeClass[severityTone[level]]);
      expect(html).toContain(level);
    }
    expect(bands.map(([r, s]) => badgeForRpn(r, s))).toEqual([
      "Critical",
      "Critical",
      "High",
      "Medium",
      "Low",
    ]);
  });

  it("colours the RPN number by the same tone", () => {
    expect(renderToStaticMarkup(createElement(RpnCell, { rpn: 250 }))).toContain("text-error");
    expect(renderToStaticMarkup(createElement(RpnCell, { rpn: 150 }))).toContain("text-warning");
    expect(renderToStaticMarkup(createElement(RpnCell, { rpn: 60 }))).toContain("text-info");
  });
});

describe("status badge", () => {
  it("keeps normal states quiet and badges only for attention states", () => {
    const quietHtml = (status: string) =>
      renderToStaticMarkup(createElement(StatusBadge, { status }));
    for (const s of ["Approved", "Extracted", "In Progress", "Not Started"]) {
      expect(quietHtml(s)).not.toContain("-badge");
    }
    expect(quietHtml("Under Review")).toContain("bg-info-badge");
    expect(quietHtml("Failed")).toContain("bg-error-badge");
  });
});

describe("unit", () => {
  it("renders the suffix in the UI font, outside the display font", () => {
    const html = renderToStaticMarkup(createElement(Unit, null, "%"));
    expect(html).toContain("font-sans");
    expect(html).not.toContain("type-display");
    expect(html).not.toContain("font-display");
  });

  it("puts the Unit inside the display-font value of a KpiTile", () => {
    const html = renderToStaticMarkup(
      createElement(KpiTile, { label: "Completion", value: 67, unit: "%" }),
    );
    expect(html).toMatch(/type-display-xl[^>]*>67<span class="[^"]*font-sans[^"]*">%<\/span>/);
  });
});

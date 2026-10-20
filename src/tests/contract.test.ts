/// <reference types="node" />
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RiskBadge, RpnCell, badgeForRpn } from "@/components/shared/RiskBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { zoneTint } from "@/components/dashboard/zoneTint";
import { tableStyles } from "@/components/ui/table-styles";
import { KpiTile, Unit } from "@/components/ui/primitives";
import { navGroups, navItems, findNav } from "@/components/layout/nav";
import { severityTone } from "@/lib/severity";
import { THEME_INIT_SCRIPT, THEME_STORAGE_KEY } from "@/components/theme/theme";
import { icons } from "@/components/icons/iconMap";

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

describe("table styles", () => {
  it("uses eyebrow headers, hairline rows, raised hover and tabular right-aligned numbers", () => {
    expect(tableStyles.th()).toContain("type-eyebrow");
    expect(tableStyles.th()).toContain("sticky");
    expect(tableStyles.th({ numeric: true })).toContain("text-right");
    expect(tableStyles.tr()).toContain("border-hairline");
    expect(tableStyles.tr()).toContain("hover:bg-raised");
    expect(tableStyles.tr()).not.toMatch(/odd:|even:/);
    expect(tableStyles.td({ numeric: true })).toContain("tabular");
    expect(tableStyles.td({ numeric: true })).toContain("text-right");
  });
});

describe("risk zones", () => {
  it("agree with RiskBadge on tone for High, Medium and Low", () => {
    const tones = { High: "warning", Medium: "info", Low: "neutral" } as const;
    for (const band of ["High", "Medium", "Low"] as const) {
      expect(severityTone[band]).toBe(tones[band]);
      const tint = zoneTint(band);
      expect(tint.bg).toBe(`var(--feedback-${tones[band]}-background)`);
      expect(tint.text).toBe(`var(--feedback-${tones[band]}-content)`);
      expect(renderToStaticMarkup(createElement(RiskBadge, { level: band }))).toContain(
        `bg-${tones[band]}-badge`,
      );
    }
  });
});

describe("icon map", () => {
  it("gives every meaning its own icon (only ai and aiAnalysis share one)", () => {
    const byComponent = new Map<unknown, string[]>();
    for (const [key, component] of Object.entries(icons)) {
      byComponent.set(component, [...(byComponent.get(component) ?? []), key]);
    }
    const shared = [...byComponent.values()].filter((keys) => keys.length > 1);
    expect(shared).toEqual([["aiAnalysis", "ai"]]);
  });

  it("draws every nav item with its icon-map entry", () => {
    const mapped = new Set<unknown>(Object.values(icons));
    for (const item of navItems) expect(mapped.has(item.icon)).toBe(true);
  });

  it("imports lucide-react only in the icon map, ui primitives and the integrations data file", () => {
    const allowed = ["components/icons/iconMap.ts", "data/integrations.ts"];
    const walk = (dir: string): string[] =>
      readdirSync(join(src, dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name).split("\\").join("/")],
      );
    const offenders = walk(".")
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .filter((f) => !f.startsWith("components/ui/") && !allowed.includes(f))
      .filter((f) => /^import\s+(?!type\s)[^;]*?from\s+"lucide-react"/m.test(read(f)));
    expect(offenders).toEqual([]);
  });

  it("sets one global stroke width of 1.75", () => {
    expect(read("styles.css")).toMatch(/svg\.lucide\s*\{\s*stroke-width:\s*1\.75;/);
  });
});

describe("login gate", () => {
  const store = new Map<string, string>();
  const stubWindow = () => {
    (globalThis as { window?: unknown }).window = {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => void store.set(k, v),
        removeItem: (k: string) => void store.delete(k),
      },
    };
  };

  it("redirects a fresh visit to /login for every protected path", async () => {
    const { shouldRedirectToLogin } = await import("@/lib/auth");
    stubWindow();
    store.clear();
    for (const p of ["/", "/overview", "/workspace", "/hierarchy"]) {
      expect(shouldRedirectToLogin(p)).toBe(true);
    }
    expect(shouldRedirectToLogin("/login")).toBe(false);
  });

  it("lets a signed-in visitor through, and gates again after sign-out", async () => {
    const { shouldRedirectToLogin, login, logout } = await import("@/lib/auth");
    stubWindow();
    store.clear();
    login("a@b.co", "x");
    expect(store.has("pragnaai_auth")).toBe(true);
    expect(shouldRedirectToLogin("/overview")).toBe(false);
    logout();
    expect(shouldRedirectToLogin("/overview")).toBe(true);
  });

  it("never redirects on the server", async () => {
    const { shouldRedirectToLogin } = await import("@/lib/auth");
    delete (globalThis as { window?: unknown }).window;
    expect(shouldRedirectToLogin("/overview")).toBe(false);
  });

  it("registers the guard on the root route", () => {
    expect(read("routes/__root.tsx")).toContain("shouldRedirectToLogin(location.pathname)");
  });
});

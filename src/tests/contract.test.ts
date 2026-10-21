/// <reference types="node" />
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
import { AppIcon, FLAT_FALLBACKS, ICON_NAMES, TIERS } from "@/components/icons/AppIcon";

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

describe("brand colour", () => {
  const css = readFileSync(join(src, "styles", "tokens.css"), "utf8");
  const light = css.slice(0, css.indexOf('[data-theme="dark"],'));
  const dark = css.slice(css.indexOf('[data-theme="dark"],'));
  const hex = (block: string, name: string) =>
    new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block)?.[1] ?? "";
  const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lum = (h: string) => {
    const [r, g, b] = rgb(h).map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const hue = (h: string) => {
    const [r, g, b] = rgb(h).map((v) => v / 255);
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);
    if (d === 0) return 0;
    const raw = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return (raw * 60 + 360) % 360;
  };

  it("defines the Wayam brand ramp and a gradient in light, and brand text in dark", () => {
    expect(hex(light, "brand-500")).toBe("#f0731a");
    expect(hex(light, "brand-600")).toBe("#dc440c");
    expect(light).toContain("#dc440c 0%, #f0731a 45%, #fa8d23 75%, #ffa12b 100%");
    expect(dark).toContain("--brand-text: #ffa12b");
  });

  it("keeps High amber, not brand orange, and readable in both themes", () => {
    for (const [block, bg, badgeText] of [
      [light, "#ffffff", "#ffffff"],
      [dark, "#101010", "#ffffff"],
    ] as const) {
      const content = hex(block, "feedback-warning-content");
      const badge = /--feedback-warning-badge:\s*(#[0-9a-fA-F]{6})/.exec(block)?.[1] ?? "";
      expect(hue(content)).toBeGreaterThan(36);
      expect(hue(content)).toBeLessThan(52);
      expect(contrast(content, bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(badge, badgeText)).toBeGreaterThanOrEqual(4.5);
    }
    expect(hue("#f0731a")).toBeLessThan(30);
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
      ["Overview", 1],
      ["Project", 1],
      ["Analysis", 4],
      ["Knowledge", 2],
      ["Delivery", 2],
    ]);
  });

  it("draws Project Overview as a solo block and every other group collapsible, with no counts", () => {
    expect(navGroups.filter((g) => g.solo).map((g) => g.items[0].url)).toEqual(["/overview"]);
    expect(navGroups.every((g) => g.solo || g.items.length > 0)).toBe(true);
    for (const item of navItems) expect(item).not.toHaveProperty("count");
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
  const publicDir = join(process.cwd(), "public", "images", "icons");
  const walk = (dir: string): string[] =>
    readdirSync(join(src, dir), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name).split("\\").join("/")],
    );

  it("gives every meaning its own picture (only the listed aliases share one)", () => {
    const byPicture = new Map<string, string[]>();
    for (const [key, component] of Object.entries(icons)) {
      const id = `${component.iconName}|${component.transform ?? ""}`;
      byPicture.set(id, [...(byPicture.get(id) ?? []), key]);
    }
    const shared = [...byPicture.values()].filter((keys) => keys.length > 1);
    expect(shared.map((keys) => [...keys].sort()).sort()).toEqual([
      ["ai", "aiAnalysis"],
      ["chart", "range"],
      ["items", "workspace"],
    ]);
  });

  it("uses every picture at least once and resolves every key to existing files", () => {
    const used = new Set(Object.values(icons).map((c) => c.iconName));
    for (const name of ICON_NAMES) expect(used.has(name)).toBe(true);
    for (const name of ICON_NAMES) {
      for (const tier of TIERS) {
        for (const x of [1, 2]) {
          expect(existsSync(join(publicDir, `${name}-${tier}@${x}x.png`))).toBe(true);
        }
      }
    }
    for (const name of FLAT_FALLBACKS) {
      expect(existsSync(join(publicDir, "fallback", `${name}.svg`))).toBe(true);
    }
  });

  it("renders a decorative image with a 1x and 2x source, and a flat SVG at 16px for fallbacks", () => {
    const html = renderToStaticMarkup(createElement(AppIcon, { name: "search", size: 28 }));
    expect(html).toContain('alt=""');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("search-28@1x.png 1x, ");
    expect(html).toContain("search-28@2x.png 2x");
    expect(renderToStaticMarkup(createElement(AppIcon, { name: "chevron", size: 12 }))).toContain(
      "fallback/chevron.svg",
    );
    expect(renderToStaticMarkup(createElement(AppIcon, { name: "chevron", size: 20 }))).toContain(
      "chevron-20@1x.png",
    );
  });

  it("draws every nav item with its icon-map entry", () => {
    const mapped = new Set<unknown>(Object.values(icons));
    for (const item of navItems) expect(mapped.has(item.icon)).toBe(true);
  });

  it("imports no icon library anywhere in src and has no lucide stylesheet rule", () => {
    const offenders = walk(".")
      .filter((f) => /\.(ts|tsx)$/.test(f) && !f.startsWith("tests/"))
      .filter((f) => /from\s+"lucide-react"/.test(read(f)));
    expect(offenders).toEqual([]);
    expect(read("styles.css")).not.toContain("lucide");
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

describe("copy", () => {
  it("has no em dashes anywhere in src", () => {
    const dash = String.fromCharCode(0x2014);
    const walk = (dir: string): string[] =>
      readdirSync(join(src, dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
      );
    const offenders = walk(".")
      .filter((f) => /\.(ts|tsx|md|css)$/.test(f))
      .filter((f) => read(f).includes(dash));
    expect(offenders).toEqual([]);
  });
});

describe("device tree", () => {
  it("opens the first two levels and the Battery Pack branch, then expands and collapses", async () => {
    const { HIERARCHY } = await import("@/data/hierarchy");
    const { initialOpen, visibleRows, toggleOpen } = await import("@/lib/tree");
    const open = initialOpen(HIERARCHY);
    const ids = () => visibleRows(HIERARCHY, open).map((r) => r.node.id);
    expect(open.has("cg3000") && open.has("power") && open.has("battery-pack")).toBe(true);
    expect(ids()).toContain("li-ion");
    expect(ids()).not.toContain("photodiode");

    const expanded = toggleOpen(open, "spo2");
    expect(visibleRows(HIERARCHY, expanded).map((r) => r.node.id)).toContain("photodiode");
    expect(open.has("spo2")).toBe(false); // input untouched

    const collapsed = toggleOpen(expanded, "spo2");
    expect(visibleRows(HIERARCHY, collapsed).map((r) => r.node.id)).not.toContain("photodiode");
    expect(visibleRows(HIERARCHY, toggleOpen(open, "cg3000", false))).toHaveLength(1);
  });

  it("derives the path from the data, not a hardcoded system name", async () => {
    const { HIERARCHY } = await import("@/data/hierarchy");
    const { ancestorNames, visibleRows, initialOpen } = await import("@/lib/tree");
    expect(ancestorNames(HIERARCHY, "battery-pack")).toEqual([
      "CardioGuard 3000",
      "Power Management System",
    ]);
    expect(ancestorNames(HIERARCHY, "photodiode")).toEqual([
      "CardioGuard 3000",
      "Patient Interface System",
      "SpO2 Module",
    ]);
    const rows = visibleRows(HIERARCHY, initialOpen(HIERARCHY));
    expect(rows.find((r) => r.node.id === "bms")?.parentId).toBe("battery-pack");
  });

  it("marks the tree up with ARIA roles", () => {
    const page = read("routes/hierarchy.tsx");
    expect(page).toContain('role="tree"');
    expect(page).toContain('role="treeitem"');
    expect(page).toContain("aria-expanded");
  });
});

describe("copy separators", () => {
  it("uses a middle dot, not a spaced hyphen, as a separator in strings", () => {
    const walk = (dir: string): string[] =>
      readdirSync(join(src, dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name).split("\\").join("/")],
      );
    const files = walk(".").filter(
      (f) => /\.(ts|tsx)$/.test(f) && !f.startsWith("tests/") && f !== "routeTree.gen.ts",
    );
    const offenders = files.filter((f) => /"[^"\n]* - [^"\n]*"/.test(read(f)));
    expect(offenders).toEqual([]);
    expect(read("components/layout/AIAssistantPanel.tsx")).not.toContain(" - ");
  });
});

describe("product name", () => {
  const walk = (dir: string): string[] =>
    readdirSync(join(src, dir), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
    );
  const INTERNAL_IDS = [
    "pragnaai_auth",
    "pragnaai-theme",
    "pragnaai-sidebar-groups",
    "pragnaai-sidebar-expanded",
    "pragnaai:open-assistant",
  ];

  it("shows TATVAM, with no visible PragnaAI text left in src/", () => {
    const offenders = walk("")
      .filter((f) => /\.(tsx?|css)$/.test(f) && !f.startsWith("tests"))
      .filter((f) => {
        const text = read(f)
          .split("\n")
          .filter((l) => !/^\s*(\/\/|\/?\*)/.test(l))
          .join("\n");
        const rest = INTERNAL_IDS.reduce((t, id) => t.split(id).join(""), text);
        return /pragna/i.test(rest);
      });
    expect(offenders).toEqual([]);
    expect(read("routes/__root.tsx")).toContain('title: "TATVAM"');
    expect(read("components/layout/AppSidebar.tsx")).toContain(">TATVAM<");
  });
});

import { createElement } from "react";
import { AppIcon, type IconName, type IconSize } from "./AppIcon";

export type AppIconComponent = ((props: {
  size?: IconSize;
  className?: string;
}) => React.ReactElement) & { iconName: IconName; transform?: string };

/** A map entry: the picture, plus an optional CSS turn or mirror for directional icons. */
const make = (name: IconName, transform?: string): AppIconComponent => {
  const Icon = (({ size = 16, className }) =>
    createElement(AppIcon, {
      name,
      size,
      className,
      style: transform ? { transform } : undefined,
    })) as AppIconComponent;
  Icon.iconName = name;
  Icon.transform = transform;
  return Icon;
};

/**
 * The single icon map. Every icon the app draws is looked up here by meaning, so one icon
 * always means one thing. Every entry is an <AppIcon>: the custom 3D set in
 * public/images/icons, with a flat 2-tone fallback at 16px and below where listed in AppIcon.tsx.
 * Sizes by role: 24 nav rail, 44 page header, 28 KPI tiles, 20 panel headers, 16 buttons, chips,
 * inputs and table rows, 12 to 16 small controls.
 * - `aiAnalysis` and `ai` are the same icon on purpose (the page is the AI queue); no other
 *   two keys may share a component (checked in contract.test.ts).
 * - Direction is CSS: chevronDown turns the chevron, sidebarExpand mirrors the toggle.
 */
export const icons = {
  // Navigation. The page header shows the same icon as its sidebar item.
  overview: make("overview"),
  hierarchy: make("hierarchy"),
  workspace: make("workspace"),
  aiAnalysis: make("ai"),
  riskRegister: make("risk"),
  traceability: make("traceability"),
  knowledgeBase: make("knowledge"),
  documents: make("documents"),
  integrations: make("integrations"),
  reports: make("reports"),

  // Meanings
  ai: make("ai"),
  search: make("search"),
  add: make("add"),
  export: make("export"),
  approve: make("accept"),
  sync: make("sync"),
  upload: make("upload"),
  send: make("send"),
  close: make("close"),
  menu: make("menu"),
  alert: make("alert"),
  standard: make("standard-doc"),
  external: make("external"),
  flow: make("arrow"),
  chevronRight: make("chevron"),
  chevronDown: make("chevron", "rotate(90deg)"),
  check: make("check"),
  edit: make("edit"),
  reject: make("reject"),
  flag: make("flag"),
  view: make("view"),
  reextract: make("re-extract"),
  signIn: make("sign-in"),
  mitigation: make("mitigation"),
  user: make("user"),

  // Metrics and panels (tiles, panel headers)
  items: make("workspace"),
  pending: make("pending"),
  overdue: make("overdue"),
  completion: make("completion"),
  reduction: make("reduction"),
  severity: make("severity"),
  failureMode: make("failure-mode"),
  functions: make("functions"),
  range: make("chart"),
  matrix: make("matrix"),
  chart: make("chart"),
  history: make("history"),
  database: make("database"),

  // Chrome
  notifications: make("bell"),
  help: make("help"),
  settings: make("settings"),
  logout: make("logout"),
  theme: make("theme"),
  sidebarCollapse: make("sidebar-toggle"),
  sidebarExpand: make("sidebar-toggle", "scaleX(-1)"),

  // Vendor systems (data/integrations.ts)
  plm: make("plm"),
  requirements: make("requirements"),
  qms: make("qms"),
  regulatory: make("regulatory"),
  verification: make("verification"),
  empty: make("empty"),
} satisfies Record<string, AppIconComponent>;

export type IconKey = keyof typeof icons;

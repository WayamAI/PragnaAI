import type { AppIconComponent } from "@/components/icons/iconMap";
import { icons } from "@/components/icons/iconMap";

export type NavItem = {
  title: string;
  url: string;
  icon: AppIconComponent;
  /** Quiet count shown beside the label when the sidebar is expanded. */
  count?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

// One list drives the sidebar and the top-bar group eyebrow and page title.
export const navGroups: NavGroup[] = [
  {
    label: "Project",
    items: [
      { title: "Project Overview", url: "/overview", icon: icons.overview },
      {
        title: "Product Hierarchy",
        url: "/hierarchy",
        icon: icons.hierarchy,
      },
    ],
  },
  {
    label: "Analysis",
    items: [
      {
        title: "DFMEA Workspace",
        url: "/workspace",
        icon: icons.workspace,
        count: "280",
      },
      {
        title: "AI Analysis",
        url: "/ai-analysis",
        icon: icons.aiAnalysis,
        count: "23",
      },
      {
        title: "Risk Register",
        url: "/risk-register",
        icon: icons.riskRegister,
        count: "14",
      },
      {
        title: "Traceability",
        url: "/traceability",
        icon: icons.traceability,
      },
    ],
  },
  {
    label: "Knowledge",
    items: [
      {
        title: "Knowledge Base",
        url: "/knowledge-base",
        icon: icons.knowledgeBase,
      },
      { title: "Document Vault", url: "/documents", icon: icons.documents },
    ],
  },
  {
    label: "Delivery",
    items: [
      {
        title: "Integrations",
        url: "/integrations",
        icon: icons.integrations,
        count: "6",
      },
      { title: "Reports", url: "/reports", icon: icons.reports },
    ],
  },
];

export const navItems: NavItem[] = navGroups.flatMap((g) => g.items);

export function isNavActive(url: string, pathname: string) {
  return pathname === url || (url === "/overview" && pathname === "/");
}

/** Group and item for a pathname, or undefined for routes outside the nav (404). */
export function findNav(pathname: string) {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (isNavActive(item.url, pathname)) return { group: group.label, item };
    }
  }
  return undefined;
}

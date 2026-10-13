import {
  LayoutDashboard,
  GitBranch,
  Table2,
  Sparkles,
  ShieldAlert,
  Link as LinkIcon,
  BookOpen,
  FolderOpen,
  Plug,
  FileDown,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
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
      { title: "Project Overview", url: "/overview", icon: LayoutDashboard },
      { title: "Product Hierarchy", url: "/hierarchy", icon: GitBranch },
    ],
  },
  {
    label: "Analysis",
    items: [
      { title: "DFMEA Workspace", url: "/workspace", icon: Table2, count: "280" },
      { title: "AI Analysis", url: "/ai-analysis", icon: Sparkles, count: "23" },
      { title: "Risk Register", url: "/risk-register", icon: ShieldAlert, count: "14" },
      { title: "Traceability", url: "/traceability", icon: LinkIcon },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { title: "Knowledge Base", url: "/knowledge-base", icon: BookOpen },
      { title: "Document Vault", url: "/documents", icon: FolderOpen },
    ],
  },
  {
    label: "Delivery",
    items: [
      { title: "Integrations", url: "/integrations", icon: Plug, count: "6" },
      { title: "Reports", url: "/reports", icon: FileDown },
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

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileDown,
  FileText,
  Flag,
  Flame,
  FolderOpen,
  Gauge,
  GitBranch,
  Grid3x3,
  HelpCircle,
  History,
  LayoutDashboard,
  Link as LinkIcon,
  ListChecks,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plug,
  Plus,
  RefreshCw,
  ScanText,
  Search,
  Send,
  Settings,
  ShieldAlert,
  Sparkles,
  Sun,
  Table2,
  TrendingDown,
  Upload,
  Workflow,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * The single icon map. Every icon the app draws is looked up here by meaning, so one
 * icon always means one thing. Rules:
 * - Stroke 1.75 comes from the global `svg.lucide` rule in styles.css, never per icon.
 * - Greyscale (text-tertiary and friends) in rows, buttons and nav. Colour is reserved for
 *   status, so a status icon takes its tone from the status token, not from this file.
 * - Sizes by role: 17px nav and header pucks, 16px (size-4) controls, 14px (size-3.5)
 *   inline button icons, 12px (size-3) chevrons and badges.
 * - `aiAnalysis` and `ai` are the same icon on purpose (the page is the AI queue); no other
 *   two keys may share a component (checked in contract.test.ts).
 * - Integration vendor icons live in data/integrations.ts (data file, not edited).
 */
export const icons = {
  // Navigation. The page header shows the same icon as its sidebar item.
  overview: LayoutDashboard,
  hierarchy: GitBranch,
  workspace: Table2,
  aiAnalysis: Sparkles,
  riskRegister: ShieldAlert,
  traceability: LinkIcon,
  knowledgeBase: BookOpen,
  documents: FolderOpen,
  integrations: Plug,
  reports: FileDown,

  // Meanings
  ai: Sparkles,
  search: Search,
  add: Plus,
  export: Download,
  approve: CheckCircle2,
  sync: RefreshCw,
  upload: Upload,
  send: Send,
  close: X,
  menu: Menu,
  alert: AlertTriangle,
  standard: FileText,
  external: ExternalLink,
  flow: ArrowRight,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  edit: Pencil,
  reject: XCircle,
  flag: Flag,
  view: Eye,
  reextract: ScanText,
  signIn: LogIn,

  // Metrics and panels (tiles, panel headers)
  items: ListChecks,
  pending: Clock,
  overdue: CalendarClock,
  completion: Gauge,
  reduction: TrendingDown,
  severity: Flame,
  failureMode: Zap,
  functions: Workflow,
  range: Activity,
  matrix: Grid3x3,
  chart: BarChart3,
  history: History,
  database: Database,

  // Chrome
  notifications: Bell,
  help: HelpCircle,
  settings: Settings,
  logout: LogOut,
  themeDark: Moon,
  themeLight: Sun,
  sidebarCollapse: PanelLeftClose,
  sidebarExpand: PanelLeftOpen,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof icons;

/**
 * Page marks: the 3D illustration shown in each page header, next to the lucide icon the
 * sidebar keeps. Files live in public/images/marks as `<id>-88.png` and `<id>-144.png`.
 * `empty` is the empty-state illustration. Marks are not used in rows, buttons, nav or tiles.
 */
export const marks = {
  overview: "mark-overview",
  hierarchy: "mark-hierarchy",
  workspace: "mark-workspace",
  aiAnalysis: "mark-ai-analysis",
  riskRegister: "mark-risk-register",
  traceability: "mark-traceability",
  knowledgeBase: "mark-knowledge-base",
  documents: "mark-documents",
  integrations: "mark-integrations",
  reports: "mark-reports",
  empty: "mark-empty",
} as const;

export type MarkId = (typeof marks)[keyof typeof marks];

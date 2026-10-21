import type { CSSProperties } from "react";

/** Every picture in public/images/icons, one per meaning. `empty` is the empty-state tray. */
export const ICON_NAMES = [
  "overview",
  "hierarchy",
  "workspace",
  "ai",
  "risk",
  "traceability",
  "knowledge",
  "documents",
  "integrations",
  "reports",
  "settings",
  "help",
  "bell",
  "theme",
  "sidebar-toggle",
  "user",
  "alert",
  "severity",
  "pending",
  "overdue",
  "completion",
  "reduction",
  "functions",
  "failure-mode",
  "mitigation",
  "accept",
  "reject",
  "edit",
  "flag",
  "search",
  "add",
  "export",
  "upload",
  "sync",
  "view",
  "re-extract",
  "sign-in",
  "logout",
  "send",
  "history",
  "plm",
  "requirements",
  "qms",
  "regulatory",
  "database",
  "verification",
  "standard-doc",
  "chart",
  "matrix",
  "external",
  "arrow",
  "chevron",
  "close",
  "menu",
  "check",
  "empty",
] as const;
export type IconName = (typeof ICON_NAMES)[number];

/** Pixel sizes the app draws icons at. Each maps onto a rendered tier (see TIERS). */
export type IconSize = 12 | 14 | 16 | 20 | 24 | 28 | 44;

/** Rendered 3D tiers on disk (`<name>-<tier>@1x|2x.png`). Anything else is scaled from the next tier up. */
export const TIERS = [16, 20, 24, 28, 44] as const;

/**
 * Keys that also have a flat 2-tone SVG, used at 16px and below where the 3D render turns to
 * mush or reads poorly (arrows, ticks, door frames, small marks).
 */
export const FLAT_FALLBACKS: ReadonlySet<IconName> = new Set<IconName>([
  "arrow",
  "check",
  "chevron",
  "close",
  "external",
  "history",
  "logout",
  "menu",
  "re-extract",
  "sign-in",
]);

const base = () => `${import.meta.env.BASE_URL}images/icons/`;

export function iconUrls(name: IconName, size: IconSize) {
  if (size <= 16 && FLAT_FALLBACKS.has(name)) {
    const flat = `${base()}fallback/${name}.svg`;
    return { src: flat, srcSet: undefined as string | undefined };
  }
  const tier = TIERS.find((t) => t >= size) ?? TIERS[TIERS.length - 1];
  const u = (x: 1 | 2) => `${base()}${name}-${tier}@${x}x.png`;
  return { src: u(1), srcSet: `${u(1)} 1x, ${u(2)} 2x` };
}

/** Decorative icon image. Controls that hold only an icon keep their own aria-label. */
export function AppIcon({
  name,
  size = 16,
  className,
  style,
}: {
  name: IconName;
  size?: IconSize;
  className?: string;
  style?: CSSProperties;
}) {
  const { src, srcSet } = iconUrls(name, size);
  return (
    <img
      src={src}
      srcSet={srcSet}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      draggable={false}
      className={className ? `shrink-0 select-none ${className}` : "shrink-0 select-none"}
      style={{ width: size, height: size, ...style }}
    />
  );
}

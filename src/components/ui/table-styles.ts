import { cn } from "@/lib/utils";

// Chronus table classes, defined once (CHRONUS_DESIGN_SYSTEM.md section 4.4).
// Presentation only: no sorting, pagination or selection lives here.
//
//   <div className={tableStyles.wrap}>
//     <table className={tableStyles.table}>
//       <thead><tr><th className={tableStyles.th()}>FM ID</th> ...
//       <tbody><tr className={tableStyles.tr()}><td className={tableStyles.td()}> ...

type CellOptions = {
  /** Numeric column: right-aligned with tabular figures. */
  numeric?: boolean;
  /** Emphasised cell (identifier or title column). */
  primary?: boolean;
  /** Truncate long text to one line; pair with a max-width class. */
  truncate?: boolean;
  className?: string;
};

export const tableStyles = {
  /** Card around a table: 8px radius, hairline border, horizontal scroll. */
  wrap: "overflow-x-auto rounded-lg border border-hairline bg-container",
  /** Bounded variant so the sticky header has something to stick to. */
  wrapScroll: "max-h-[70vh] overflow-auto rounded-lg border border-hairline bg-container",
  table: "w-full border-collapse",

  /** Header cell: eyebrow style, sticky, container background. */
  th: (o: Pick<CellOptions, "numeric" | "className"> = {}) =>
    cn(
      "type-eyebrow sticky top-0 z-10 border-b border-hairline bg-container px-3 py-2 whitespace-nowrap text-quaternary",
      o.numeric ? "text-right" : "text-left",
      o.className,
    ),

  /** Body row: hairline divider, no zebra, raised on hover. */
  tr: (o: { clickable?: boolean; className?: string } = {}) =>
    cn(
      "border-b border-hairline transition-colors duration-[150ms] last:border-b-0 hover:bg-raised",
      o.clickable &&
        "cursor-pointer outline-none focus-visible:bg-raised focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-active",
      o.className,
    ),

  /** Body cell: 12px secondary text, numeric columns right-aligned and tabular. */
  td: (o: CellOptions = {}) =>
    cn(
      "type-body-sm px-3 py-2 align-middle whitespace-nowrap",
      o.primary ? "text-foreground" : "text-secondary-foreground",
      o.numeric && "tabular text-right",
      o.truncate && "truncate",
      o.className,
    ),

  /** Single full-width row for an empty result. */
  emptyCell: "type-body-sm px-3 py-8 text-center text-tertiary",
};

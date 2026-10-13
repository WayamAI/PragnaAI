import { TEAM } from "@/data/team";

// Greyscale initials chip: colour is reserved for status, so the per-person
// colour in TEAM is not used here.
export function EngineerAvatar({
  name,
  showName = false,
  size = "sm",
}: {
  name: string;
  showName?: boolean;
  size?: "sm" | "md";
}) {
  const eng = TEAM[name] ?? { initials: name.slice(0, 2).toUpperCase(), name, role: "", color: "" };
  const dim = size === "md" ? "size-8" : "size-6";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`${dim} type-caption inline-flex shrink-0 items-center justify-center rounded-full border border-hairline bg-raised-2 text-secondary-foreground`}
      >
        {eng.initials}
      </span>
      {showName && <span className="type-body-md text-foreground">{eng.name}</span>}
    </span>
  );
}

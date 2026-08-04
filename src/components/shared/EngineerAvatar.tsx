import { TEAM } from "@/data/team";

export function EngineerAvatar({ name, showName = false, size = "sm" }: { name: string; showName?: boolean; size?: "sm" | "md" }) {
  const eng = TEAM[name] ?? { initials: name.slice(0, 2).toUpperCase(), name, role: "", color: "bg-slate-500 text-white" };
  const dim = size === "md" ? "h-8 w-8 text-xs" : "h-6 w-6 text-[10px]";
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`${dim} ${eng.color} inline-flex items-center justify-center rounded-full font-semibold`}>{eng.initials}</span>
      {showName && <span className="text-sm">{eng.name}</span>}
    </span>
  );
}
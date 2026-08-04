export type Engineer = {
  initials: string;
  name: string;
  role: string;
  color: string; // tailwind bg class
};

export const TEAM: Record<string, Engineer> = {
  "R. Sharma": { initials: "RS", name: "R. Sharma", role: "Systems Engineer (Lead)", color: "bg-[color:var(--primary)] text-white" },
  "P. Kaul": { initials: "PK", name: "P. Kaul", role: "Software Engineer", color: "bg-[color:var(--ai-accent)] text-white" },
  "T. Iyer": { initials: "TI", name: "T. Iyer", role: "Mechanical / Electrical Engineer", color: "bg-blue-600 text-white" },
  "A. Rodrigues": { initials: "AR", name: "A. Rodrigues", role: "Electrical Safety Engineer", color: "bg-amber-600 text-white" },
  "S. Mehta": { initials: "SM", name: "S. Mehta", role: "Quality Assurance Engineer", color: "bg-emerald-600 text-white" },
  "N. Pillai": { initials: "NP", name: "N. Pillai", role: "Regulatory Affairs Engineer", color: "bg-slate-600 text-white" },
};

export const CURRENT_USER = TEAM["R. Sharma"];
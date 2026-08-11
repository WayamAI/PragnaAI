import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { login } from "@/lib/auth";

const logoSrc = `${import.meta.env.BASE_URL}brand/wayam-logo-light.svg`;

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Enter any email and password to continue.");
      return;
    }
    setSubmitting(true);
    // Demo auth: any email/password combination is accepted.
    login(email.trim(), password);
    toast.success("Signed in.");
    navigate({ to: "/overview" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-background to-orange-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <img src={logoSrc} alt="PragnaAI" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <div className="font-display text-xl font-semibold text-foreground">PragnaAI</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              FMEA Intelligence
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <h1 className="font-display text-lg font-semibold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo mode — any email and password will work.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              <ShieldCheck className="h-4 w-4" />
              Sign in
            </button>
          </form>

          <p className="mt-4 flex items-start gap-2 rounded-md bg-accent px-3 py-2 text-xs text-accent-foreground">
            This is a demo environment. Any credentials will sign you in — no
            account is created or verified.
          </p>
        </div>
      </div>
    </div>
  );
}

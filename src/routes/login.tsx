import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { login } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "@/components/ui/input-styles";

const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

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
    <div className="flex min-h-dvh w-full bg-page">
      {/* Brand panel (large screens): solid, on the primary action colour */}
      <div className="hidden flex-[1.4] flex-col justify-between bg-action-primary p-10 text-on-color lg:flex">
        <div className="flex items-center gap-2.5">
          {/* The panel is dark in light theme and light in dark theme, so the logo pairing is inverted. */}
          <img
            src={brand("wayam-mark-dark.svg")}
            alt=""
            className="h-auto w-8 shrink-0 dark:hidden"
          />
          <img
            src={brand("wayam-mark-light.svg")}
            alt=""
            className="hidden h-auto w-8 shrink-0 dark:block"
          />
          <img src={brand("wayam-wordmark-dark.svg")} alt="" className="h-5 w-auto dark:hidden" />
          <img
            src={brand("wayam-wordmark-light.svg")}
            alt=""
            className="hidden h-5 w-auto dark:block"
          />
        </div>
        <div className="max-w-xl">
          <p className="type-eyebrow opacity-70">PragnaAI</p>
          <p className="type-display-2xl mt-3">
            AI-assisted DFMEA for medical device risk analysis.
          </p>
        </div>
      </div>

      {/* Form column */}
      <div className="flex w-full flex-col border-l border-hairline bg-container lg:w-[min(28rem,42%)]">
        <div className="flex h-14 shrink-0 items-center justify-between px-8">
          <div className="flex items-center gap-2.5 lg:invisible">
            <img
              src={brand("wayam-mark-light.svg")}
              alt="PragnaAI"
              className="h-auto w-8 dark:hidden"
            />
            <img
              src={brand("wayam-mark-dark.svg")}
              alt="PragnaAI"
              className="hidden h-auto w-8 dark:block"
            />
          </div>
          <ThemeToggle className={buttonClass("secondary", { size: "sm" })} />
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 pb-12">
          <div className="mx-auto w-full max-w-sm">
            <h1 className="type-display-xl text-foreground">Sign in</h1>
            <p className="type-body-md mt-1 text-tertiary">
              Demo mode. Any email and password will work.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass("md")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass("md")}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className={buttonClass("primary", { size: "lg", className: "mt-1 w-full" })}
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 rounded-md border border-hairline bg-raised p-3">
              <p className="type-eyebrow text-quaternary">Demo access</p>
              <p className="type-body-sm mt-1 text-tertiary">
                This is a demo environment. Any credentials will sign you in. No account is created
                or verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

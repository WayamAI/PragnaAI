import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { login } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass, labelClass } from "@/components/ui/input-styles";
import { icons } from "@/components/icons/iconMap";

const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

const INSIDE = [
  [icons.ai, "AI-suggested failure modes, scored and sourced"],
  [icons.riskRegister, "A risk register ranked by RPN"],
  [icons.traceability, "Requirement to verification traceability"],
] as const;

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
      {/* Brand panel (large screens): hero image under gradients. White text in both themes, since the image is dark. */}
      <div className="relative hidden flex-[1.4] flex-col justify-between overflow-hidden bg-black p-10 text-white lg:flex">
        <picture className="absolute inset-0">
          <source
            type="image/webp"
            srcSet={`${brand("login-hero-1280.webp")} 1280w, ${brand("login-hero.webp")} 2560w`}
            sizes="58vw"
          />
          <img
            src={brand("login-hero-1280.jpg")}
            srcSet={`${brand("login-hero-1280.jpg")} 1280w, ${brand("login-hero.jpg")} 2560w`}
            sizes="58vw"
            width={2560}
            height={1293}
            alt=""
            decoding="async"
            draggable={false}
            className="size-full object-cover object-[72%_center]"
          />
        </picture>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent"
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-2.5">
          <img src={brand("wayam-mark-dark.svg")} alt="" className="h-auto w-8 shrink-0" />
          <img src={brand("wayam-wordmark-dark.svg")} alt="" className="h-5 w-auto" />
        </div>
        <div className="relative max-w-xl">
          <p className="type-eyebrow text-white/80">PragnaAI</p>
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
            <div className="mb-8 flex items-center gap-2.5">
              <img
                src={brand("wayam-mark-light.svg")}
                alt=""
                className="h-auto w-9 shrink-0 dark:hidden"
              />
              <img
                src={brand("wayam-mark-dark.svg")}
                alt=""
                className="hidden h-auto w-9 shrink-0 dark:block"
              />
              <img
                src={brand("wayam-wordmark-light.svg")}
                alt=""
                className="h-5 w-auto dark:hidden"
              />
              <img
                src={brand("wayam-wordmark-dark.svg")}
                alt=""
                className="hidden h-5 w-auto dark:block"
              />
            </div>
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
                <icons.signIn size={16} />
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

            <ul className="mt-8 flex flex-col gap-3 border-t border-hairline pt-6">
              {INSIDE.map(([Icon, text]) => (
                <li
                  key={text}
                  className="type-body-md flex items-center gap-3 text-secondary-foreground"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-tint">
                    <Icon size={28} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  redirect,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/error-reporting";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/michroma/400.css";
import { AppShell } from "@/components/layout/AppShell";
import { AIAssistantPanel } from "@/components/layout/AIAssistantPanel";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { THEME_INIT_SCRIPT } from "@/components/theme/theme";
import { isAuthenticated, shouldRedirectToLogin } from "@/lib/auth";
import { buttonClass } from "@/components/ui/button-styles";

function NotFoundComponent() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center overflow-y-auto bg-page px-4 py-10">
      <div className="max-w-md text-center">
        <p className="type-eyebrow text-quaternary">Error 404</p>
        <h1 className="type-display-2xl mt-3 text-foreground">Page not found</h1>
        <p className="type-body-md mt-3 text-tertiary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/" className={buttonClass("primary", { size: "lg" })}>
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="max-w-md text-center">
        <p className="type-eyebrow text-quaternary">Something went wrong</p>
        <h1 className="type-display-xl mt-3 text-foreground">This page didn't load</h1>
        <p className="type-body-md mt-3 text-tertiary">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className={buttonClass("primary", { size: "lg" })}
          >
            Try again
          </button>
          <a href="/" className={buttonClass("secondary", { size: "lg" })}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Client-side gate: a visitor without a session lands on /login before any page renders.
  beforeLoad: ({ location }) => {
    if (shouldRedirectToLogin(location.pathname)) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PragnaAI" },
      {
        name: "description",
        content: "AI-assisted DFMEA platform for medical device risk analysis.",
      },
      { name: "author", content: "" },
      { property: "og:title", content: "PragnaAI" },
      {
        property: "og:description",
        content: "AI-assisted DFMEA platform for medical device risk analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
    scripts: [{ children: THEME_INIT_SCRIPT }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const router = useRouter();
  // null = not yet checked (avoids an SSR/localStorage mismatch flash),
  // true/false = known auth state once mounted on the client.
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const ok = isAuthenticated();
    setAuthed(ok);
    if (!ok && pathname !== "/login") {
      router.navigate({ to: "/login" });
    }
  }, [pathname]);

  if (pathname === "/login") {
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    );
  }

  if (!authed) {
    // Either still checking auth on first client render, or a redirect to
    // /login is in flight — render nothing to avoid a dashboard flash.
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        onMobileToggle={() => setSidebarOpen((o) => !o)}
      >
        <Outlet />
      </AppShell>
      <AIAssistantPanel />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}

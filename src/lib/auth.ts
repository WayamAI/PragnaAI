/**
 * Demo authentication for PragnaAI.
 *
 * This is intentionally NOT real auth: any email + any password combination
 * is accepted. It exists purely to gate the app behind a login screen for
 * demo purposes. Session state lives in localStorage on the client only.
 */

const STORAGE_KEY = "pragnaai_auth";

export type DemoSession = {
  email: string;
  loggedInAt: string;
};

export function getSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

/**
 * True when a visitor with no session must be sent to /login before anything renders.
 * Always false on the server, which cannot read localStorage and must not bounce signed-in users.
 */
export function shouldRedirectToLogin(pathname: string): boolean {
  if (typeof window === "undefined") return false;
  return pathname !== "/login" && !isAuthenticated();
}

/** Accepts any non-empty email + password, demo purposes only. */
export function login(email: string, _password: string): DemoSession {
  const session: DemoSession = { email, loggedInAt: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

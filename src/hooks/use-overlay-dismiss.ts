import { useEffect, useRef } from "react";

/** Close on Escape while `active`, and hand focus back to whatever opened the overlay. */
export function useOverlayDismiss(active: boolean, onClose: () => void) {
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!active) return;
    opener.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener.current?.focus?.();
    };
    // onClose is intentionally excluded: callers pass inline closures.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}

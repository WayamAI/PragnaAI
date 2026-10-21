import { useEffect, useId, useState } from "react";
import { icons } from "@/components/icons/iconMap";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button-styles";
import { inputClass } from "@/components/ui/input-styles";
import { useOverlayDismiss } from "@/hooks/use-overlay-dismiss";

type Msg = { role: "user" | "ai"; text: string };

const CANNED: Record<string, string> = {
  critical: `Found 14 failure modes with Severity >= 9.\n\nCRITICAL (S=9):\nFM-0032  Thermal runaway due to charging IC failure     RPN 36\nFM-0034  Cell swelling due to overcharge                RPN 54\nFM-0038  Thermal sensor open circuit                    RPN 36\nFM-0039  Thermal sensor offset drift                    RPN 108\nFM-0048  Insufficient hold-up during mains loss         RPN 81\nFM-0203  Alarm fatigue · delayed response               RPN 108\n\nS=10 (Catastrophic):\nFM-0047  Mains isolation failure                        RPN 20\nFM-0102  Cable insulation degradation                   RPN 60\nFM-0202  Loss of protective earth                       RPN 60`,
  pending: `7 mitigation actions are past their due date.\n\nMIT-0033-A  BMS watchdog validation      Owner: P. Kaul     Overdue 55d\nMIT-0039-B  Thermal calibration check    Owner: P. Kaul     Overdue 34d\nMIT-0046-A  Kalman filter SoC update     Owner: P. Kaul     Overdue 9d\nMIT-0101-B  Cable flex test validation   Owner: T. Iyer     Overdue 34d\nMIT-0103-A  Connector durability test    Owner: T. Iyer     Overdue 26d`,
  battery: `Battery Pack subsystem: 18 failure modes, 2 critical (S>=9).\nAvg initial RPN 66, avg residual RPN 29 (56% reduction).\nOpen items: FM-0033, FM-0039, FM-0041, FM-0046, FM-0048.`,
};

export function AIAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi R. Sharma, ask me anything about the CardioGuard 3000 DFMEA." },
  ]);
  const [thinking, setThinking] = useState(false);
  const titleId = useId();
  useOverlayDismiss(open, () => setOpen(false));

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const key = Object.keys(CANNED).find((k) => text.toLowerCase().includes(k));
      const reply =
        (key && CANNED[key]) ||
        `Analyzing "${text}"...\n\nI can help you filter the Risk Register, review AI suggestions, or generate reports. Try:\n• "Show critical risks"\n• "Pending mitigations"\n• "Battery risks"`;
      setMsgs((m) => [...m, { role: "ai", text: reply }]);
      setThinking(false);
    }, 1300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-40 flex size-11 items-center justify-center rounded-full border border-strong bg-action-primary text-on-color outline-none transition-colors duration-[180ms] ease-out hover:bg-action-primary-hover focus-visible:ring-2 focus-visible:ring-active"
        aria-label="Open AI Assistant (Cmd+K)"
      >
        <icons.ai className="size-5" aria-hidden="true" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 text-foreground">
          <div
            className="absolute inset-0 bg-page/70"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="animate-in slide-in-from-right absolute inset-y-0 right-0 flex w-full flex-col border-l border-strong bg-container sm:w-[400px]"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
              <h2 id={titleId} className="type-label-md flex items-center gap-2 text-foreground">
                <icons.ai className="size-4 text-tertiary" aria-hidden="true" />
                PragnaAI Assistant
              </h2>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMsgs(msgs.slice(0, 1))}
                  className={buttonClass("ghost", { size: "sm" })}
                >
                  Clear
                </button>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className={buttonClass("icon")}
                >
                  <icons.close className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "rounded-lg p-3",
                    m.role === "user"
                      ? "type-body-md ml-auto max-w-[85%] bg-action-primary text-on-color"
                      : "type-body-sm mr-auto max-w-[95%] border border-hairline bg-raised font-mono leading-relaxed whitespace-pre-wrap text-secondary-foreground",
                  )}
                >
                  {m.text}
                </div>
              ))}
              {thinking && (
                <div
                  className="mr-auto flex gap-1 rounded-lg border border-hairline bg-raised p-3"
                  role="status"
                  aria-label="Assistant is typing"
                >
                  <span className="size-2 animate-bounce rounded-full bg-quaternary [animation-delay:0ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-quaternary [animation-delay:150ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-quaternary [animation-delay:300ms]" />
                </div>
              )}
            </div>
            <div className="shrink-0 border-t border-hairline p-3">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {["Show critical risks", "Pending mitigations", "Battery risks"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className={buttonClass("chip")}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question…"
                  aria-label="Ask a question"
                  className={inputClass("sm", "flex-1")}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className={buttonClass("primary", { className: "size-8 px-0" })}
                >
                  <icons.send className="size-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

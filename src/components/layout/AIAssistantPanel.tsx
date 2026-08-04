import { useEffect, useState } from "react";
import { Sparkles, X, Send } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const CANNED: Record<string, string> = {
  critical: `Found 14 failure modes with Severity >= 9.\n\nCRITICAL (S=9):\nFM-0032  Thermal runaway due to charging IC failure     RPN 36\nFM-0034  Cell swelling due to overcharge                RPN 54\nFM-0038  Thermal sensor open circuit                    RPN 36\nFM-0039  Thermal sensor offset drift                    RPN 108\nFM-0048  Insufficient hold-up during mains loss         RPN 81\nFM-0203  Alarm fatigue - delayed response               RPN 108\n\nS=10 (Catastrophic):\nFM-0047  Mains isolation failure                        RPN 20\nFM-0102  Cable insulation degradation                   RPN 60\nFM-0202  Loss of protective earth                       RPN 60`,
  pending: `7 mitigation actions are past their due date.\n\nMIT-0033-A  BMS watchdog validation      Owner: P. Kaul     Overdue 55d\nMIT-0039-B  Thermal calibration check    Owner: P. Kaul     Overdue 34d\nMIT-0046-A  Kalman filter SoC update     Owner: P. Kaul     Overdue 9d\nMIT-0101-B  Cable flex test validation   Owner: T. Iyer     Overdue 34d\nMIT-0103-A  Connector durability test    Owner: T. Iyer     Overdue 26d`,
  battery: `Battery Pack subsystem: 18 failure modes, 2 critical (S>=9).\nAvg initial RPN 66, avg residual RPN 29 (56% reduction).\nOpen items: FM-0033, FM-0039, FM-0041, FM-0046, FM-0048.`,
};

export function AIAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi R. Sharma — ask me anything about the CardioGuard 3000 DFMEA." },
  ]);
  const [thinking, setThinking] = useState(false);

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
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--ai-accent)] text-white shadow-lg transition hover:scale-105"
        aria-label="Open AI Assistant (Cmd+K)"
      >
        <Sparkles className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-[400px] flex-col border-l bg-card shadow-2xl animate-in slide-in-from-right">
          <div className="flex h-[52px] items-center justify-between border-b bg-[color:var(--ai-bg)] px-4">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-[color:var(--ai-accent)]" />
              RiskLens AI Assistant
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMsgs(msgs.slice(0, 1))} className="text-xs text-muted-foreground hover:text-foreground">Clear</button>
              <button onClick={() => setOpen(false)} aria-label="Close" className="rounded p-1 hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`rounded-lg p-3 text-sm ${m.role === "user" ? "ml-auto max-w-[85%] bg-primary text-primary-foreground" : "mr-auto max-w-[95%] bg-muted whitespace-pre-wrap font-mono text-xs leading-relaxed"}`}>
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="mr-auto flex gap-1 rounded-lg bg-muted p-3">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
              </div>
            )}
          </div>
          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1">
              {["Show critical risks", "Pending mitigations", "Battery risks"].map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-full border bg-background px-2 py-1 text-[11px] hover:bg-muted">
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="submit" className="rounded-md bg-primary px-3 py-2 text-primary-foreground hover:opacity-90">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
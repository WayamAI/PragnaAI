/** Window event that opens the AI assistant drawer. The top bar button dispatches it. */
export const OPEN_ASSISTANT_EVENT = "pragnaai:open-assistant";

export const openAssistant = () => window.dispatchEvent(new Event(OPEN_ASSISTANT_EVENT));

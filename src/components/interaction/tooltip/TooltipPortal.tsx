import { createPortal } from "react-dom";

export function TooltipPortal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}

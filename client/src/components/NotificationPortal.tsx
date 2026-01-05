import { createPortal } from "react-dom";

export const NotificationPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};

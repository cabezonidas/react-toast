import { ReactNode } from "react";

type VerticalSide = "top" | "bottom";
type HorizontalSide = "Left" | "Center" | "Right";

export type ToastPosition = `${VerticalSide}${HorizontalSide}`;
export type ToastNode = ReactNode | ((e: { close: () => void }) => ReactNode);
export type ToastOptions = {
  timeout?: number;
  position?: ToastPosition;
  onLeave?: (id: number) => void;
};

export type ToastAction =
  | { type: "add"; notification: ToastNode; options?: ToastOptions; id: number }
  | { type: "remove"; id: number };

export interface IToast {
  id: number;
  notification: ToastNode;
  options?: ToastOptions;
  createdAt: number;
  updatedAt: number;
}

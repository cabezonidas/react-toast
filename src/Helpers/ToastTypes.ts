import { ReactNode } from "react";

export type ToastOptions = {
  timeout?: number;
  position?:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight";
  onLeave?: (id: number) => void;
};

export type ToastAction =
  | {
      type: "add";
      notification: ReactNode | ((e: { close: () => void }) => ReactNode);
      options?: ToastOptions;
      id: number;
    }
  | { type: "remove"; id: number };

export interface IToast {
  id: number;
  notification: ReactNode | ((e: { close: () => void }) => ReactNode);
  options?: ToastOptions;
  createdAt: number;
  updatedAt: number;
}

import React, { ReactNode, useContext, useMemo } from "react";
import { Expand } from "./Helpers/Expand";
import { getToastProviderEl } from "./Helpers/getToastProviderEl";
import { ToastAction, ToastOptions } from "./Helpers/ToastTypes";
import { ToastContext } from "./ToastProvider";

type Config = Expand<ToastOptions & { id?: number }>;

const getUniquetoastid = (): number => {
  const id = Number(`${Math.floor(Math.random() * 10_000_000)}`.slice(0, 4));
  const selector = `[data-toastid="${id}"]`;
  const duplicate = getToastProviderEl().querySelectorAll(selector)?.length > 0;
  if (duplicate) {
    return getUniquetoastid();
  }
  return id;
};

const toastFunctions = (
  dispatch?: React.Dispatch<ToastAction>,
): {
  toast: (
    notification: ReactNode | ((e: { close: () => void }) => ReactNode),
    config?: Config,
  ) => number;
  dismiss: (toastid: number) => void;
} => {
  const toast = (
    notification: ReactNode | ((e: { close: () => void }) => ReactNode),
    config: Config = {},
  ) => {
    const { id = getUniquetoastid(), ...options } = config;
    dispatch?.({ type: "add", notification, options, id });
    return id;
  };

  return {
    toast,
    dismiss: (id) => dispatch?.({ type: "remove", id }),
  };
};

/**
 * Hook to display pop-up messages in response to a user action or state change. Examples include: Saving, exporting, committing, deleting, etc.
 * @example
 * // Custom toasts accept `ReactNode` or `({ close: () => void }) => ReactNode`
 * const { toast } = useToast();
 * toast(({ close }) => <button onClick={() => close()}>Click me to dismiss</button>, { timeout: Infinity });
 * toast(<div>I will be dismissed in 3s.</div>, { timeout: 3000 });
 * toast("I'm placed in the topLeft of the page", { position: 'topLeft' });
 */
export const useToast = () => {
  const dispatch = useContext(ToastContext);
  return useMemo(() => toastFunctions(dispatch), [dispatch]);
};

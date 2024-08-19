import { useReducer } from "react";
import { IToast, ToastAction } from "./ToastTypes";

type ToastState = {
  toasts: IToast[];
  stack: number;
};

export const reducer = (state: ToastState, action: ToastAction): ToastState => {
  const updatedAt = new Date().getTime();
  if (action.type === "add") {
    const { notification, options, id } = action;
    const base = { notification, options, id, updatedAt };
    const found = state.toasts.find((t) => t.id === id);
    if (!found) {
      const toast = { ...base, createdAt: updatedAt };
      const toasts = [toast, ...state.toasts];
      return trim({ ...state, toasts });
    } else {
      const toast = { ...found, ...base };
      const toasts = state.toasts.map((t) => (t.id !== id ? t : toast));
      return { ...state, toasts };
    }
  }
  if (action.type === "remove") {
    return {
      ...state,
      toasts: state.toasts.filter((t) => t.id !== action.id),
    };
  }
  return state;
};

export const useToastState = ({ stack }: { stack: number }) => {
  const [state, dispatch] = useReducer(reducer, {
    toasts: [],
    stack,
  });

  const toasts = group(state.toasts);

  return { toasts, dispatch };
};

const group = (list: IToast[]) => {
  const initial: IToast[] = [];
  return list.reduce(
    (res, item) => {
      const position = item?.options?.position ?? "topRight";
      return { ...res, [position]: [...res[position], item] };
    },
    {
      topLeft: initial,
      topCenter: initial,
      topRight: initial,
      bottomLeft: initial,
      bottomCenter: initial,
      bottomRight: initial,
    },
  );
};

const trim = (state: ToastState) => ({
  ...state,
  toasts: Object.values(group(state.toasts))
    .map((toasts) =>
      toasts
        .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
        .slice(0, state.stack),
    )
    .flat(),
});

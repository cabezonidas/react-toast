import React, { Dispatch, ReactNode, useCallback, useContext } from "react";
import { createPortal } from "react-dom";
import { getToastProviderEl } from "./Helpers/getToastProviderEl";
import { ToastSection } from "./Helpers/ToastSection";
import { ToastAction, ToastOptions } from "./Helpers/ToastTypes";
import { useToastState } from "./Helpers/useToastState";

type ToastPosition = NonNullable<ToastOptions["position"]>;

export const ToastContext = React.createContext<
  Dispatch<ToastAction> | undefined
>(undefined);

const portal = getToastProviderEl();

export const ToastProvider = ({
  children,
  defaultTimeout = 4000,
  stack = 5,
}: {
  defaultTimeout?: number;
  stack?: number;
  children: ReactNode;
}) => {
  const { toasts, dispatch } = useToastState({ stack });
  const remove = useCallback(
    (id: number) => dispatch({ type: "remove", id }),
    [dispatch],
  );

  if (useContext(ToastContext)) {
    return <>{children}</>;
  }

  return (
    <>
      {createPortal(
        <>
          {Object.entries(toasts).map(([section, list]) => (
            <ToastSection
              key={section}
              {...{
                position: section as ToastPosition,
                list,
                remove,
                defaultTimeout,
              }}
            />
          ))}
        </>,
        portal,
      )}
      <ToastContext.Provider value={dispatch}>{children}</ToastContext.Provider>
    </>
  );
};

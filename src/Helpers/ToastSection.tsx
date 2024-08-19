import "./ToastSection.css";

import React, { Fragment, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { getToastProviderEl } from "./getToastProviderEl";
import { IToast, ToastPosition } from "./ToastTypes";

const getToastSectionEl = (position: ToastPosition) => {
  const portal = getToastProviderEl();
  let section = portal.getElementsByClassName(position)[0] as HTMLDivElement;
  if (section) {
    return section as HTMLDivElement;
  }
  section = document.createElement("div");
  section.className = `ToastSection ${position}`;
  portal.appendChild(section);
  return section as HTMLDivElement;
};

export const ToastSection = ({
  position,
  list,
  remove,
  defaultTimeout,
}: {
  position: ToastPosition;
  list: IToast[];
  remove: (id: number) => void;
  defaultTimeout: number;
}) => {
  const section = getToastSectionEl(position);
  const [state, setState] = useState(list);

  useEffect(
    /**
     * Delay deletions from provider state. Add instead a 'ItemDeleted' class to the
     * toasts that are pending deletion to trigger an exiting animation.
     *
     * Because of this local copy of the global state, any toasts additions need to be
     * copied over in a useEffect as well.
     */
    function delayToastsDeletionAndAddNewOnes() {
      const deleted = state
        .filter((s) => !list.some((l) => l.id === s.id))
        .map((s) => s.id);

      const added = list.filter((l) => !state.some((s) => s.id === l.id));

      deleted
        .map((id) => section.querySelector(`[data-toastid="${id}"]`))
        .forEach((deletedToast) => deletedToast?.classList.add("ItemDeleted"));

      if (added.length) {
        setState((prev) => [...prev, ...added]);
      }
    },
    [list, state],
  );

  useEffect(
    /**
     * Capture toast updates to be copied to the local state
     */
    function updateExistingToasts() {
      if (list.length === state.length) {
        const updated = list.filter((l) =>
          state.find((s) => s.id === l.id && s.updatedAt !== l.updatedAt),
        );
        if (updated.length) {
          setState((prev) =>
            prev.map((p) => updated.find((u) => u.id === p.id) ?? p),
          );
        }
      }
    },
    [list, state],
  );

  useEffect(
    /**
     * Capture 'animationend' so that once a toast has left the page, it can
     * be cleared from the local state.
     *
     * @description It uses `addEventListener` in the section, because the
     * section portal may have been created by a parent App and not necessarily
     * the consumer application.
     */
    function clearLocalStateAfterDeleteAnimationEnds() {
      const animationEnd = (e: AnimationEvent) => {
        const animatedToast = e.target as HTMLDivElement;
        const animatedId = Number(animatedToast.getAttribute("data-toastid"));
        if (animatedToast.classList.contains("ItemDeleted")) {
          state
            .find((s) => s.id === animatedId)
            ?.options?.onLeave?.(animatedId);
          setState((prev) => prev.filter((t) => t.id !== animatedId));
        }
      };
      section.addEventListener("animationend", animationEnd);
      return () => section.removeEventListener("animationend", animationEnd);
    },
    [section, state],
  );

  return ReactDOM.createPortal(
    <Fragment key={position}>
      {state.map((toast) => (
        <Toast key={toast.id} {...{ toast, remove, defaultTimeout }} />
      ))}
    </Fragment>,
    section,
  );
};

const Toast = (props: {
  toast: IToast;
  remove: (notificationId: number) => void;
  defaultTimeout: number;
}) => {
  const { toast, remove, defaultTimeout } = props;

  const close = useCallback(() => remove(toast.id), [remove, toast.id]);

  const ms = toast.options?.timeout ?? defaultTimeout;
  const shouldPersist = [
    NaN,
    Infinity,
    Number.MAX_SAFE_INTEGER,
    Number.MAX_VALUE,
  ].includes(ms);

  useEffect(() => {
    if (!shouldPersist) {
      const timer = setTimeout(close, ms);
      return () => clearTimeout(timer);
    }
    return;
  }, [shouldPersist, ms, close]);

  return (
    <div data-toastid={toast.id}>
      {typeof toast.notification === "function"
        ? toast.notification({ close })
        : toast.notification}
    </div>
  );
};

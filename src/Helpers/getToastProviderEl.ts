const portalId = "global-toast-container";

/**
 * Retrieves the toast provider container element. It creates a new
 * one if it hasn't been created already.
 *
 * @description It is expected that application A, renders application B, that happens to render
 * the new toasts as well. In this case, application B will still render the context
 * provider to handle their toasts, but it will re-use the portal created by A.
 *
 * When the provider is created, it will observe older toasts coming to the screen
 * to make them visually align with the new ones. This needs to happens when the portal is
 * created, regardless of what app has created it.
 *
 * @returns HTMLDivElement
 */
export const getToastProviderEl = (): HTMLDivElement => {
  let portal = document.getElementById(portalId) as HTMLDivElement;
  if (portal) {
    return portal;
  }
  portal = document.createElement("div");
  portal.id = portalId;
  portal.className = "ToastProvider";

  if (document.body.firstChild) {
    document.body.insertBefore(portal, document.body.firstChild);
  } else {
    document.body.appendChild(portal);
  }

  return portal;
};

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

  new MutationObserver(
    () => (portal.style.gridTemplateColumns = gridTemplateColumns(portal)),
  ).observe(portal, {
    childList: true,
    subtree: true,
  });

  return portal;
};

const gridTemplateColumns = (portal: HTMLDivElement) => {
  const getToasts = (section: string) =>
    portal.querySelector(`.ToastSection.${section}`)?.childNodes?.length ?? 0;

  const topLeft = getToasts("topLeft");
  const bottomLeft = getToasts("bottomLeft");
  const left = topLeft + bottomLeft;

  const topCenter = getToasts("topCenter");
  const bottomCenter = getToasts("bottomCenter");
  const center = topCenter + bottomCenter;

  const topRight = getToasts("topRight");
  const bottomRight = getToasts("bottomRight");
  const right = topRight + bottomRight;

  if (left && !center && !right) {
    return `1fr 0fr 0fr`;
  }

  if (!left && !center && right) {
    return `0fr 0fr 1fr`;
  }

  if (center && !left && !right) {
    return `0fr 1fr 0fr`;
  }

  if (!center && left && right) {
    return `1fr 0fr 1fr`;
  }

  return `1fr 1fr 1fr`;
};

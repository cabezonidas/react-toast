import { fireEvent, render, screen } from "@testing-library/react";
import React, { useRef } from "react";
import { ToastProvider } from "./ToastProvider";
import { useToast } from "./useToast";

const TestComponent = () => {
  const { toast, dismiss } = useToast();
  const toastId = useRef<number>();
  const renderCount = useRef(0);
  renderCount.current = renderCount.current + 1;
  return (
    <>
      <div>Render count: {renderCount.current}</div>
      <button
        type="button"
        onClick={() => (toastId.current = toast("newtoast"))}
      >
        TOAST
      </button>
      <button
        type="button"
        onClick={() => toast("updated", { id: toastId.current })}
      >
        UPDATE
      </button>
      <button type="button" onClick={() => dismiss(toastId.current!)}>
        DISMISS
      </button>
    </>
  );
};

describe("ToastProvider", () => {
  it("render toasts", async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "TOAST" }));
    const toast = screen.getByText("newtoast");

    fireEvent.click(screen.getByRole("button", { name: "UPDATE" }));
    expect(toast.textContent).toBe("updated");

    fireEvent.click(screen.getByRole("button", { name: "DISMISS" }));
    expect(toast.closest("[data-toastid]")?.classList.contains("ItemDeleted"));

    // Updating the toast state doesn't affect the render counts of consumer
    expect(screen.findByText("Render count: 1"));
  });
});

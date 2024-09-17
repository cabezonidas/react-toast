import { IToast, ToastAction, ToastOptions } from "./ToastTypes";
import { reducer } from "./useToastState";

type ToastPosition = NonNullable<ToastOptions["position"]>;

describe("useToastState", () => {
  it("adds a toast", () => {
    const initialState = { toasts: [], stack: 1 };
    const action: ToastAction = { type: "add", id: 1, notification: "test" };
    const result = reducer(initialState, action);

    expect(result.toasts.length).toEqual(1);
    expect(result.toasts[0].id).toEqual(1);
    expect(result.toasts[0].notification).toEqual("test");
  });
  it("removes a toast", () => {
    const timestamps = { createdAt: 0, updatedAt: 0 };
    const toast: IToast = { id: 1, notification: "test", ...timestamps };
    const initialState = { toasts: [toast], stack: 1 };
    const action: ToastAction = { type: "remove", id: 1 };
    const result = reducer(initialState, action);

    expect(result.toasts.length).toEqual(0);
  });
  it("updates a toast", () => {
    const timestamps = { createdAt: 0, updatedAt: 0 };
    const toast: IToast = { id: 1, notification: "test", ...timestamps };
    const initialState = { toasts: [toast], stack: 1 };
    const action: ToastAction = { type: "add", id: 1, notification: "new" };
    const result = reducer(initialState, action);

    expect(result.toasts.length).toEqual(1);
    expect(result.toasts[0].id).toEqual(1);
    expect(result.toasts[0].notification).toEqual("new");
    expect(result.toasts[0].updatedAt).toBeGreaterThan(toast.updatedAt);
  });
  it("removes older from stack when section is full", () => {
    let id = 1;
    type Props = { notification: string; position: ToastPosition };
    const getToast = ({ notification, position }: Props): IToast => {
      const toast = {
        id,
        notification,
        options: { position },
        createdAt: id,
        updatedAt: id,
      };
      id++;
      return toast;
    };

    const initialState = {
      toasts: [
        getToast({ notification: "1", position: "topLeft" }),
        getToast({ notification: "2", position: "topLeft" }),
        getToast({ notification: "3", position: "topRight" }),
      ],
      stack: 2,
    };

    const addToFullPosition: ToastAction = {
      type: "add",
      ...getToast({ notification: "4", position: "topLeft" }),
    };

    const addToHalfFullPosition: ToastAction = {
      type: "add",
      ...getToast({ notification: "5", position: "topRight" }),
    };

    const resultTemp = reducer(initialState, addToHalfFullPosition);
    const result = reducer(resultTemp, addToFullPosition);

    expect(result.toasts.length).toEqual(4);

    const topLeft = result.toasts.filter(
      (t) => t.options?.position === "topLeft",
    );

    expect(topLeft.length).toBe(2);
    expect(topLeft.some((t) => t.notification === "2")).toBeTruthy();
    expect(topLeft.some((t) => t.notification === "4")).toBeTruthy();

    const topRight = result.toasts.filter(
      (t) => t.options?.position === "topRight",
    );

    expect(topRight.length).toBe(2);
    expect(topRight.some((t) => t.notification === "3")).toBeTruthy();
    expect(topRight.some((t) => t.notification === "5")).toBeTruthy();
  });
});

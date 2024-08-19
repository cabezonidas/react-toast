import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useToast } from "./useToast";
import { ToastProvider } from "./ToastProvider";
import { ToastOptions } from "./Helpers/ToastTypes";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";

type StoryProps = ToastOptions & { message: string };

const ToasterButton = ({ message, ...config }: StoryProps) => {
  const { toast } = useToast();
  return (
    <button type="button" onClick={() => toast(message, config)}>
      Toast
    </button>
  );
};

const Toaster = ({ stack, ...props }: StoryProps & { stack: number }) => {
  return (
    <ToastProvider stack={stack}>
      <ToasterButton {...props} />
    </ToastProvider>
  );
};

const meta = {
  title: "Example/Toast",
  component: Toaster,
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toast: Story = {
  args: {
    stack: 3,
    position: "topRight",
    timeout: 2000,
    onLeave: fn((id) => console.log(`Toast #${id} deleted`)),
    message: "Basic example",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button"));
    await waitFor(() => expect(args.onLeave).toHaveBeenCalled(), {
      timeout: args.timeout! + 500,
    });
  },
};

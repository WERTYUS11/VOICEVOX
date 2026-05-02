import { userEvent, within, expect, fn } from "storybook/test";

import { Meta, StoryObj } from "@storybook/vue3-vite";
import QuestionDialog from "./QuestionDialog.vue";
import { UnreachableError } from "@/type/utility";

const meta: Meta<typeof QuestionDialog> = {
  component: QuestionDialog,
  args: {
    type: "info",
    modelValue: true,
    title: "标题",
    message: "留言",
    buttons: ["A", "B", "C"],

    "onUpdate:modelValue": fn(),
    onOk: fn(),
    onHide: fn(),
  },
  tags: ["!autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Opened: Story = {
  name: "开启中",
  args: {
    modelValue: true,
  },
};

export const OpenedMultiline: Story = {
  name: "打开：多行",
  args: {
    ...Opened.args,
    message: "留言\n多行",
  },
};

export const OpenedButtonColor: Story = {
  name: "打开：改变按钮颜色",
  args: {
    ...Opened.args,
    buttons: [
      { text: "primary", color: "primary" },
      { text: "warning", color: "warning" },
      "default",
    ],
  },
};

export const Close: Story = {
  name: "按A",
  args: { ...Opened.args },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: "A" });
    await userEvent.click(button);

    await expect(args["onUpdate:modelValue"]).toBeCalledWith(false);
    await expect(args["onOk"]).toBeCalledWith({ index: 0 });
  },
};

export const ClickBackdropWithoutCancel: Story = {
  name: "persistent: true按下背景不会被取消",
  args: { ...Opened.args },
  play: async ({ args }) => {
    const backdrop = document.body.querySelector(".DialogOverlay");
    if (!backdrop) throw new UnreachableError();
    await userEvent.click(backdrop);

    await expect(args["onUpdate:modelValue"]).not.toBeCalled();
    await expect(args["onOk"]).not.toBeCalled();
  },
};

export const ClickBackdropWithCancel: Story = {
  name: "persistent: false按背景将被取消",
  args: { ...Opened.args, buttons: ["A", "キャンセル"], persistent: false },
  play: async ({ args }) => {
    const backdrop = document.body.querySelector(".DialogOverlay");
    if (!backdrop) throw new UnreachableError();
    await userEvent.click(backdrop);

    await expect(args["onUpdate:modelValue"]).toBeCalledWith(false);
    await expect(args["onOk"]).not.toBeCalled();
  },
};

export const Closed: Story = {
  name: "关闭",
  tags: ["skip-screenshot"],
  args: {
    modelValue: false,
  },
};

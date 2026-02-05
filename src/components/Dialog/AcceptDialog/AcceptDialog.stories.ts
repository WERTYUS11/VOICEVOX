import { userEvent, within, expect, fn } from "storybook/test";

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AcceptDialog from "./AcceptDialog.vue";

const meta: Meta<typeof AcceptDialog> = {
  component: AcceptDialog,
  args: {
    dialogOpened: false,
    title: "标题",
    heading: "小标题",
    terms: "# 小标题1\n文章文章文章\n## 小标题2\n文章文章文章",
    rejectLabel: "拒绝",
    acceptLabel: "同意",
    onAccept: fn(),
    onReject: fn(),
    "onUpdate:dialogOpened": fn(),
  },
  tags: ["!autodocs"], // ダイアログ系はautodocsのプレビューが正しく表示されないので無効化
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Opened: Story = {
  name: "打开状态",
  args: {
    dialogOpened: true,
  },
};

export const Accept: Story = {
  name: "点击同意按钮",
  args: { ...Opened.args },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: /同意/ });
    await userEvent.click(button);

    // 同意イベントが呼ばれる
    await expect(args["onAccept"]).toBeCalledWith();
  },
};

export const Reject: Story = {
  name: "点击拒绝按钮",
  args: {
    ...Opened.args,
  },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: /拒绝/ });
    await userEvent.click(button);

    // 拒绝イベントが呼ばれる
    await expect(args["onReject"]).toBeCalledWith();
  },
};

export const Closed: Story = {
  name: "关闭状态",
  tags: ["skip-screenshot"],
};

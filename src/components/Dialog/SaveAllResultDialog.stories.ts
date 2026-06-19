import { userEvent, within } from "storybook/test";

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import SaveAllResultDialog from "./SaveAllResultDialog.vue";

const meta: Meta<typeof SaveAllResultDialog> = {
  component: SaveAllResultDialog,
  args: {
    modelValue: true,
    successArray: ["/path/to/success1.wav", "/path/to/success2.wav"],
    writeErrorArray: [
      {
        path: "/path/to/write_error.wav",
        message: "没有写入权限",
      },
    ],
    engineErrorArray: [
      {
        path: "/path/to/engine_error.wav",
        message: "引擎无响应",
      },
    ],
  },
  tags: ["!autodocs"], // ダイアログ系はautodocsのプレビューが正しく表示されないので無効化
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Opened: Story = {
  name: "打开中",
  args: {},
};

export const Close: Story = {
  name: "按下关闭按钮",
  args: { ...Opened.args },
  play: async () => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: "关闭" });
    await userEvent.click(button);
  },
};

export const SingleError: Story = {
  name: "仅一个错误",
  args: {
    successArray: [],
    writeErrorArray: [
      {
        path: "/path/to/error.wav",
        message: "磁盘空间不足",
      },
    ],
    engineErrorArray: [],
  },
};

export const Mixed: Story = {
  name: "成功与错误混杂",
  args: {
    successArray: ["/path/to/success1.wav", "/path/to/success2.wav"],
    writeErrorArray: [
      {
        path: "/path/to/write_error.wav",
        message: "没有写入权限",
      },
    ],
    engineErrorArray: [
      {
        path: "/path/to/engine_error1.wav",
        message: "引擎无响应",
      },
      {
        path: "/path/to/engine_error2.wav",
        message: "引擎无响应",
      },
    ],
  },
};

export const Closed: Story = {
  name: "已关闭",
  tags: ["skip-screenshot"],
  args: {
    modelValue: false,
  },
};

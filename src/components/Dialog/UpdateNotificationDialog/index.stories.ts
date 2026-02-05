import { userEvent, within, expect, fn } from "storybook/test";

import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Presentation from "./Presentation.vue";

const meta: Meta<typeof Presentation> = {
  component: Presentation,
  args: {
    dialogOpened: false,
    latestVersion: "1.0.0",
    newUpdateInfos: [
      {
        version: "1.1.0",
        descriptions: ["新增功能１", "新增功能２"],
        contributors: ["不会被显示"],
      },
      {
        version: "1.0.1",
        descriptions: ["错误修复"],
        contributors: ["不会被显示"],
      },
    ],
    "onUpdate:dialogOpened": fn(),
    onSkipThisVersionClick: fn(),
  },
  tags: ["!autodocs"], // ダイアログ系はautodocsのプレビューが正しく表示されないので無効化
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Opened: Story = {
  name: "已打开",
  args: {
    dialogOpened: true,
  },
};

export const Close: Story = {
  name: "按下关闭按钮",
  args: { ...Opened.args },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: /关闭/ });
    await userEvent.click(button);

    // ダイアログを关闭イベントが呼ばれる
    await expect(args["onUpdate:dialogOpened"]).toBeCalledWith(false);
  },
};

export const SkipThisVersion: Story = {
  name: "按下跳过按钮",
  args: {
    ...Opened.args,
  },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", {
      name: /跳过此版本/,
    });
    await userEvent.click(button);

    // スキップイベントが呼ばれる
    await expect(args["onSkipThisVersionClick"]).toBeCalledWith("1.0.0");
    // ダイアログを关闭イベントが呼ばれる
    await expect(args["onUpdate:dialogOpened"]).toBeCalledWith(false);
  },
};

export const OpenOfficialSite: Story = {
  name: "按下打开官网按钮",
  args: { ...Opened.args },
  play: async ({ args }) => {
    window.open = fn();

    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", {
      name: /打开官网/,
    });
    await userEvent.click(button);

    // 公式サイトが開かれる
    await expect(window.open).toBeCalledWith(
      "https://github.com/WERTYUS11/VOICEVOX/",
      "_blank",
    );
    // ダイアログを关闭イベントが呼ばれる
    await expect(args["onUpdate:dialogOpened"]).toBeCalledWith(false);
  },
};

export const Closed: Story = {
  name: "閉じている",
  tags: ["skip-screenshot"],
};

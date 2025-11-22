import { userEvent, within, expect, fn } from "storybook/test";

import { Meta, StoryObj } from "@storybook/vue3-vite";
import FileNameTemplateDialog from "./FileNameTemplateDialog.vue";
import {
  buildAudioFileNameFromRawData,
  DEFAULT_AUDIO_FILE_NAME_TEMPLATE,
} from "@/store/utility";

const meta: Meta<typeof FileNameTemplateDialog> = {
  component: FileNameTemplateDialog,
  args: {
    availableTags: [
      "index",
      "characterName",
      "styleName",
      "text",
      "date",
      "projectName",
    ],
    defaultTemplate: DEFAULT_AUDIO_FILE_NAME_TEMPLATE,
    savedTemplate: "",
    fileNameBuilder: buildAudioFileNameFromRawData,
    extension: ".wav",
    "onUpdate:template": fn(),
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

/** 文件名模式をクリアし、文字列を入力する */
const clearAndInput = async (inputValue: string) => {
  const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う
  const input = canvas.getByLabelText<HTMLInputElement>("文件名模式");
  await userEvent.clear(input);
  if (inputValue) {
    await userEvent.type(input, inputValue);
  }
};

/** 無効な文字列を入力し、エラーメッセージが表示されることを確認する */
const createInvalidInputPlay =
  (inputValue: string, expectedMessage: string | RegExp) => async () => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    await clearAndInput(inputValue);

    await expect(await canvas.findByText(expectedMessage)).toBeInTheDocument();
  };

export const EmptyInput: Story = {
  name: "无效输入：空白",
  args: { ...Opened.args },
  play: createInvalidInputPlay("", "请输入内容"),
};

export const ForbiddenInput: Story = {
  name: "无效的输入：禁用字符",
  args: { ...Opened.args },
  play: createInvalidInputPlay(
    "$連番$/",
    /^包含不可用字符：「.+」$/,
  ),
};

export const UnknownTagInput: Story = {
  name: "无效输入：未知标签",
  args: { ...Opened.args },
  play: createInvalidInputPlay(
    "$連番$测试$",
    "存在非法标签或单独包含 '",
  ),
};

export const UnclosedTagInput: Story = {
  name: "无效输入：未闭合的标签",
  args: { ...Opened.args },
  play: createInvalidInputPlay(
    "$連番$",
    "存在非法标签或单独包含 '",
  ),
};

export const MissingIndexInput: Story = {
  name: "无效输入：没有序列号",
  args: { ...Opened.args },
  play: createInvalidInputPlay("a", "$序列号 $ 是必需的"),
};

export const Save: Story = {
  name: "点击确定按钮",
  args: {
    ...Opened.args,
  },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    await clearAndInput("$連番$");

    const button = canvas.getByRole("button", { name: "确定" });
    await userEvent.click(button);

    // 确定とダイアログを閉じるイベントが呼ばれる
    await expect(args["onUpdate:template"]).toBeCalledWith("$連番$");
    await expect(args["onUpdate:dialogOpened"]).toBeCalledWith(false);
  },
};

export const Unsaveable: Story = {
  name: "无效输入时无法点击确定按钮",
  args: { ...Opened.args },
  play: async () => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    await clearAndInput("无效输入");

    const button = canvas.getByRole("button", { name: "确定" });
    await expect(button).toBeDisabled();
  },
};

export const Close: Story = {
  name: "点击取消按钮",
  args: {
    ...Opened.args,
  },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: "取消" });
    await userEvent.click(button);

    // ダイアログを閉じるイベントが呼ばれる、确定イベントは呼ばれない
    await expect(args["onUpdate:template"]).not.toBeCalled();
    await expect(args["onUpdate:dialogOpened"]).toBeCalledWith(false);
  },
};

export const Closed: Story = {
  name: "关闭",
  tags: ["skip-screenshot"],
  args: {
    dialogOpened: false,
  },
};
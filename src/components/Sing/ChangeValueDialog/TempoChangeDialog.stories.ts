import { userEvent, within, expect, fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/vue3-vite";
import TempoChangeDialog from "./TempoChangeDialog.vue";
import { DEFAULT_BPM } from "@/sing/domain";

const meta: Meta<typeof TempoChangeDialog> = {
  component: TempoChangeDialog,
  args: {
    modelValue: true,
    tempoChange: {
      bpm: DEFAULT_BPM,
    },
    mode: "add",

    onOk: fn(),
    onHide: fn(),
  },
  tags: ["!autodocs"], // ダイアログ系はautodocsのプレビューが正しく表示されないので無効化
};

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateOpened: Story = {
  name: "已打开：添加",
  args: {
    modelValue: true,
    mode: "add",
  },
};
export const ChangeOpened: Story = {
  name: "已打开：更改",
  args: {
    modelValue: true,
    tempoChange: {
      bpm: 120,
    },
    mode: "edit",
  },
};

export const ClickOk: Story = {
  name: "点击确定按钮以添加",
  args: { ...CreateOpened.args },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const input = canvas.getByLabelText("节奏");
    await userEvent.clear(input);
    await userEvent.type(input, "100");

    const button = canvas.getByRole("button", { name: /添加/ });
    await userEvent.click(button);

    await expect(args["onOk"]).toBeCalledWith({
      tempoChange: {
        bpm: 100,
      },
    });
  },
};

export const ClickDelete: Story = {
  name: "点击确定按钮以编辑",
  args: { ...ChangeOpened.args },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const input = canvas.getByLabelText("节奏");
    await userEvent.clear(input);
    await userEvent.type(input, "100");

    const button = canvas.getByRole("button", { name: /更改/ });
    await userEvent.click(button);

    await expect(args["onOk"]).toBeCalledWith({
      tempoChange: {
        bpm: 100,
      },
    });
  },
};

export const CancelClose: Story = {
  name: "点击取消按钮放弃所做的一切",
  args: { ...ChangeOpened.args },
  play: async ({ args }) => {
    const canvas = within(document.body); // ダイアログなので例外的にdocument.bodyを使う

    const button = canvas.getByRole("button", { name: /取消/ });
    await userEvent.click(button);

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

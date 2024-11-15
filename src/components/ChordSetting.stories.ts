import ChordSetting from "./ChordSetting.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

type Story = StoryObj<typeof ChordSetting>;

const meta = {
    title: "Setting/ChordSetting",
    component: ChordSetting,
} satisfies Meta<typeof ChordSetting>;

export default meta;

export const Default: Story = {};

import ChordSettingHeader from "./Header.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

type Story = StoryObj<typeof ChordSettingHeader>;

const meta = {
    title: "Setting/ChordSettingHeader",
    component: ChordSettingHeader,
} satisfies Meta<typeof ChordSettingHeader>;

export default meta;

export const Default: Story = {};

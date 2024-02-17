import ChordSettingHeader from "./Header.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

type Story = StoryObj<typeof ChordSettingHeader>;

const meta: Meta<typeof ChordSettingHeader> = {
    title: "Setting/ChordSettingHeader",
    component: ChordSettingHeader,
    render: (args) => ({
        components: { ChordSettingHeader },
        setup() {
            return { args };
        },
        template: "<ChordSettingHeader v-bind='args' />",
    }),
};

export default meta;

export const Default: Story = {};

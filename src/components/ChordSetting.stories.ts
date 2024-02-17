import ChordSetting from "./ChordSetting.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

type Story = StoryObj<typeof ChordSetting>;

const meta: Meta<typeof ChordSetting> = {
    title: "Setting/ChordSetting",
    component: ChordSetting,
    render: (args) => ({
        components: { ChordSetting },
        setup() {
            return { args };
        },
        template: "<ChordSetting v-bind='args' />",
    }),
};

export default meta;

export const Default: Story = {};

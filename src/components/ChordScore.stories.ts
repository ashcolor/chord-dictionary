import ChordScore from "./ChordScore.vue";
import type { Meta, StoryObj } from "@storybook/vue3";

type Story = StoryObj<typeof ChordScore>;

const chord = {
    original: [
        {
            key: 6,
            offset: 0,
        },
        {
            key: 1,
            offset: 1,
        },
        {
            key: 3,
            offset: 1,
        },
    ],
};

const meta: Meta<typeof ChordScore> = {
    title: "ChordScore",
    component: ChordScore,
    render: (args) => ({
        components: { ChordScore },
        setup() {
            return { args };
        },
        template: "<ChordScore v-bind='args'/>",
    }),
    args: {
        chord: chord,
    },
};

export const Default: Story = {};

export default meta;

// export default {
//     component: ChordScore,
//     argTypes: {
//         settings: {},
//     },
// };

// const Template = (args, { argTypes }) => ({
//     props: Object.keys(argTypes),
//     components: { ChordScore },
//     template: '<Setting v-bind="$props" />',
// });

// export const Normal = Template.bind({});
// Normal.args = {
//     settings: {
//         isShow: null,
//         language: null,
//         key: 0,
//         offset: 0,
//         isTranspose: false,
//         transposeKey: 0,
//         transposeOffset: 0,
//         vol: 0.84,
//         delay: 600,
//         duration: 1.5,
//         arpeggio: 0.04,
//         clef: "treble",
//         note: "quarter",
//         inst: "piano",
//         isDelay: false,
//         isArpeggio: false,
//         isColorNote: false,
//         isColorNoteName: false,
//         isShowRoman: false,
//         isActiveClick: true,
//         isActiveKey: true,
//         isActiveHover: false,
//     },
// };

import ChordScore from "./ChordScore.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import ChordNote from "../../assets/ChordNote.js";

type Story = StoryObj<typeof ChordScore>;

const chordName = "C";
const chord = ChordNote.parseContent(chordName, 0);

const meta: Meta<typeof ChordScore> = {
    title: "Card/ChordScore",
    component: ChordScore,
    render: (args) => ({
        components: { ChordScore },
        setup() {
            return { args };
        },
        template: "<ChordScore v-bind='args'/>",
    }),
    args: {
        chordName,
        chordOriginal: chord.original,
    },
};

export default meta;

export const Default: Story = {};

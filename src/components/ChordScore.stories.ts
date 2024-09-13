import ChordScore from "./ChordScore.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import ChordNote from "../../assets/ChordNote.js";

type Story = StoryObj<typeof ChordScore>;

const chordName = "C";
const chord = ChordNote.parseContent(chordName, 0);

const meta = {
    title: "Card/ChordScore",
    component: ChordScore,
    args: {
        chordName,
        chordOriginal: chord.original,
    },
} satisfies Meta<typeof ChordScore>;

export default meta;

export const Default: Story = {};

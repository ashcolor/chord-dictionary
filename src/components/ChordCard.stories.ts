import ChordCard from "./ChordCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import ChordNote from "../../assets/ChordNote.js";

type Story = StoryObj<typeof ChordCard>;

const chordName = "C";
const chord = ChordNote.parseContent(chordName, 0);

const meta: Meta<typeof ChordCard> = {
    title: "Card/ChordCard",
    component: ChordCard,
    render: (args) => ({
        components: { ChordCard },
        setup() {
            return { args };
        },
        template: "<ChordCard v-bind='args'/>",
    }),
    args: {
        chordIsInterval: true,
        chordName: chord.name,
        chordOriginal: chord.original,
        chordOriginalElement: chord.originalElement,
        chordTitleElement: chord.titleElement,
        chordSubtitleElement: chord.subtitleElement,
    },
};

export default meta;

export const Default: Story = {
    args: {},
};

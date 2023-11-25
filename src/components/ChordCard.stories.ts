import ChordCard from "./ChordCard.vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import ChordNote from "../../assets/ChordNote.js";
import { KEYS } from "../../src/config/const.ts";

type Story = StoryObj<typeof ChordCard>;

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
    args: {},
};

export default meta;

const chordName = "C";
const chord = ChordNote.parseContent(chordName, 0);
export const Default: Story = {
    args: {
        chordIsInterval: true,
        chordName: chord.name,
        chordOriginal: chord.original,
        chordOriginalElement: chord.originalElement,
        chordTitleElement: chord.titleElement,
        chordSubtitleElement: chord.subtitleElement,
    },
};

const accidentals = ["", "#", "♭"];
const KeyWithAccidentalArray = KEYS.map((key) => {
    return accidentals.map((accidental) => {
        return `${key.label}${accidental}`;
    });
}).flat();

const modifiers = [
    "7",
    "m",
    "m7",
    "M7",
    "mM7",
    "sus4",
    "7sus4",
    "dim",
    "m7-5",
    "aug",
    "add9",
    "6",
    "m6",
];

const chordNameMatrix = KeyWithAccidentalArray.map((key) => {
    return modifiers.map((modifier) => {
        return `${key}${modifier}`;
    });
});

const argsMatrix = chordNameMatrix.map((testChordNames) => {
    return testChordNames.map((testChordName) => {
        const c = ChordNote.parseContent(testChordName, 0);
        return {
            chordIsInterval: true,
            chordName: c.name,
            chordOriginal: c.original,
            chordOriginalElement: c.originalElement,
            chordTitleElement: c.titleElement,
            chordSubtitleElement: c.subtitleElement,
        };
    });
});

export const List: Story = {
    render: (args) => ({
        components: { ChordCard },
        setup() {
            return { args };
        },
        template: `
            <div class="flex flex-col flex-wrap gap-8 w-full">
                <template v-for="argsArray in args.argsMatrix" >
                    <div class="flex flex-row no-wrap gap-2 w-full overflow-scroll">
                        <template v-for="a in argsArray" >
                        <ChordCard v-bind="a" />
                        </template>
                    </div>
                </template>
            </div>
        `,
    }),
    args: {
        argsMatrix: argsMatrix,
    },
};

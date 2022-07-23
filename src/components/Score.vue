<script setup>
import { CLEFS, NOTES, COLORS } from "../config/const";
import Vex from "vexflow";
</script>

<script>
export default {
    props: {
        chord: Object,
        settings: Object,
    },
    watch: {
        chord: function (newVal, oldVal) {
            if (newVal.string === oldVal.string) return false;
            this.dispScore();
        },
    },
    mounted() {
        this.dispScore();
    },
    methods: {
        dispScore: function () {
            if (!this.chord.original) return;
            const div = document.getElementById("chord-dictionary-score");
            if (!div) return;
            div.textContent = "";

            const VF = Vex.Flow;
            const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
            const context = renderer.getContext();
            const stave = new VF.Stave(0, 0, 0);
            stave.addClef(this.settings.clef);
            stave.setContext(context);

            var octave =
                CLEFS[this.settings.clef].octave +
                (this.chord.original[0].key < CLEFS[this.settings.clef].note);
            const notes = new VF.StaveNote({
                clef: this.settings.clef,
                keys: this.chord.original.map(
                    function (item, index) {
                        return (
                            "CDEFGAB".charAt(item.key) +
                            "/" +
                            (this.chord.original[index - 1] &&
                            item.key <= this.chord.original[index - 1].key
                                ? ++octave
                                : octave)
                        );
                    }.bind(this)
                ),
                duration: NOTES[this.settings.note].duration,
            });

            this.chord.original.forEach((note, index) => {
                if (note.offset) {
                    const acci = note.offset < 0 ? "bb" : "##",
                        repetition = Math.abs(note.offset) >> 1;
                    for (var i = 0; i < repetition; i++)
                        notes.addAccidental(index, new VF.Accidental(acci));
                    if (note.offset & 1)
                        notes.addAccidental(index, new VF.Accidental(note.offset < 0 ? "b" : "#"));
                }
                if (this.settings.isColorNote)
                    notes.setKeyStyle(index, { fillStyle: COLORS[note.toHalf()] });
            });

            const voice = new VF.Voice({
                num_beats: 1,
                beat_value: NOTES[this.settings.note].num,
            });
            voice.addTickables([notes]);
            new VF.Formatter().joinVoices([voice]).format([voice]);
            voice.setStave(stave);

            //音符の描画位置の調整
            const box = voice.getBoundingBox();
            renderer.resize(
                box.w + 80,
                Math.max(Math.abs(box.y) + box.h + 15 + (this.settings.note != "whole") * 15, 110)
            );
            stave.setWidth(box.w + 65);
            stave.setY(Math.max(20 - box.y, 0));

            stave.draw();
            voice.draw(context, stave);
            this.$emit("updated");
        },
    },
};
</script>

<template>
    <div id="chord-dictionary-score"></div>
</template>

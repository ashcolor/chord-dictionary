<script setup>
import { onMounted, watch } from "vue";
import Vex from "vexflow";
import { CLEFS, NOTES, COLORS } from "../config/const";

const props = defineProps({
    chord: Object,
    settings: Object,
});

const emit = defineEmits(["input"]);

onMounted(() => {
    dispScore();
});

watch(props.chord, (newVal, oldVal) => {
    if (newVal.string === oldVal.string) return;
    dispScore();
});

const dispScore = () => {
    if (!props.chord.original) return;
    const div = document.getElementById("chord-dictionary-score");
    if (!div) return;
    div.textContent = "";

    const VF = Vex.Flow;
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    const context = renderer.getContext();
    const stave = new VF.Stave(0, 0, 0);
    stave.addClef(props.settings.clef);
    stave.setContext(context);

    let octave =
        CLEFS[props.settings.clef].octave +
        (props.chord.original[0].key < CLEFS[props.settings.clef].note);
    const notes = new VF.StaveNote({
        clef: props.settings.clef,
        keys: props.chord.original.map(
            (item, index) =>
                "CDEFGAB".charAt(item.key) +
                "/" +
                (props.chord.original[index - 1] && item.key <= props.chord.original[index - 1].key
                    ? ++octave
                    : octave)
        ),
        duration: NOTES[props.settings.note].duration,
    });

    props.chord.original.forEach((note, index) => {
        if (note.offset) {
            const acci = note.offset < 0 ? "bb" : "##",
                repetition = Math.abs(note.offset) >> 1;
            for (let i = 0; i < repetition; i++)
                notes.addAccidental(index, new VF.Accidental(acci));
            if (note.offset & 1)
                notes.addAccidental(index, new VF.Accidental(note.offset < 0 ? "b" : "#"));
        }
        if (props.settings.isColorNote)
            notes.setKeyStyle(index, { fillStyle: COLORS[note.toHalf()] });
    });

    const voice = new VF.Voice({
        num_beats: 1,
        beat_value: NOTES[props.settings.note].num,
    });
    voice.addTickables([notes]);
    new VF.Formatter().joinVoices([voice]).format([voice]);
    voice.setStave(stave);

    //音符の描画位置の調整
    const box = voice.getBoundingBox();
    renderer.resize(
        box.w + 80,
        Math.max(Math.abs(box.y) + box.h + 15 + (props.settings.note != "whole") * 15, 110)
    );
    stave.setWidth(box.w + 65);
    stave.setY(Math.max(20 - box.y, 0));

    stave.draw();
    voice.draw(context, stave);
    emit("updated");
};
</script>

<template>
    <div id="chord-dictionary-score"></div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useSettingsStore } from "../store/useSettings";
import Vex from "vexflow";
import { CLEFS, NOTES, SCORE_NOTE_COLORS } from "../config/const";

const settingStore = useSettingsStore();
const { settings } = settingStore;

const props = defineProps({
    chord: Object,
});

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
    stave.addClef(settings.clef);
    stave.setContext(context);

    let octave =
        CLEFS[settings.clef].octave + (props.chord.original[0].key < CLEFS[settings.clef].note);
    const notes = new VF.StaveNote({
        clef: settings.clef,
        keys: props.chord.original.map(
            (item, index) =>
                "CDEFGAB".charAt(item.key) +
                "/" +
                (props.chord.original[index - 1] && item.key <= props.chord.original[index - 1].key
                    ? ++octave
                    : octave)
        ),
        duration: NOTES[settings.note].duration,
    });

    props.chord.original.forEach((note, index) => {
        if (note.offset) {
            const acci = note.offset < 0 ? "bb" : "##",
                repetition = Math.abs(note.offset) >> 1;
            for (let i = 0; i < repetition; i++) {
                notes.addModifier(new VF.Accidental(acci), index);
            }
            if (note.offset & 1) {
                notes.addModifier(new VF.Accidental(note.offset < 0 ? "b" : "#"), index);
            }
        }
        if (settings.isColorNote) notes.setKeyStyle(index, { fillStyle: SCORE_NOTE_COLORS[note.toHalf()] });
    });

    const voice = new VF.Voice({
        num_beats: 1,
        beat_value: NOTES[settings.note].num,
    });
    voice.addTickables([notes]);
    new VF.Formatter().joinVoices([voice]).format([voice]);
    voice.setStave(stave);

    //音符の描画位置の調整
    const box = voice.getBoundingBox();
    renderer.resize(
        box.w + 80,
        Math.max(Math.abs(box.y) + box.h + 15 + (settings.note != "whole") * 15, 110)
    );
    stave.setWidth(box.w + 65);
    stave.setY(Math.max(20 - box.y, 0));

    stave.draw();
    voice.draw(context, stave);
};
</script>

<template>
    <div id="chord-dictionary-score"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useSettingsStore } from "../store/useSettings";
import Vex from "vexflow";
import { CLEFS, NOTES, SCORE_NOTE_COLORS } from "../config/const";
import { Note } from "../utils/note";

const settingStore = useSettingsStore();
const { settings } = settingStore;

interface Original {
    key: number;
    offset: number;
}

interface Props {
    chordName: string;
    chordOriginal: Array<Original>;
}

const props = withDefaults(defineProps<Props>(), {
    chordName: "",
    chordOriginal: () => [],
});

const renderElement = ref<HTMLDivElement | null>(null);

watch(
    () => props.chordName,
    (newVal, oldVal) => {
        if (newVal === oldVal) return;
        renderScore();
    }
);

onMounted(() => {
    renderScore();
});

const renderScore = () => {
    if (!props.chordOriginal) return;

    if (!renderElement.value) return;

    renderElement.value.textContent = "";

    // 初期設定
    const VF = Vex.Flow;
    const renderer = new VF.Renderer(renderElement.value, VF.Renderer.Backends.SVG);
    const context = renderer.getContext();
    const stave = new VF.Stave(0, 0, 0);

    const clef = settings.clef;

    stave.addClef(clef);
    stave.setContext(context);

    // 音符
    let octave =
        CLEFS[settings.clef].octave +
        (props.chordOriginal[0].key < CLEFS[settings.clef].note ? 1 : 0);

    const keys = props.chordOriginal.map(
        (item, index) =>
            "CDEFGAB".charAt(item.key) +
            "/" +
            (props.chordOriginal[index - 1] && item.key <= props.chordOriginal[index - 1].key
                ? ++octave
                : octave)
    );

    const duration = NOTES[settings.note].duration;

    const notes = new VF.StaveNote({ clef, keys, duration });

    // 臨時記号
    props.chordOriginal.forEach((note, index) => {
        if (note.offset) {
            const accidental = note.offset < 0 ? "bb" : "##",
                repetition = Math.abs(note.offset) >> 1;
            for (let i = 0; i < repetition; i++) {
                notes.addModifier(new VF.Accidental(accidental), index);
            }
            if (note.offset & 1) {
                notes.addModifier(new VF.Accidental(note.offset < 0 ? "b" : "#"), index);
            }
        }
        if (settings.isColorNote) {
            const half = Note.toHalf(note.key, note.offset);
            notes.setKeyStyle(index, { fillStyle: SCORE_NOTE_COLORS[half] });
        }
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

    if (!box) return;

    renderer.resize(
        box.w + 80,
        Math.max(Math.abs(box.y) + box.h + 15 + (settings.note !== "whole" ? 1 : 0) * 15, 110)
    );
    stave.setWidth(box.w + 65);
    stave.setY(Math.max(20 - box.y, 0));

    stave.draw();
    voice.draw(context, stave);
};
</script>

<template>
    <div ref="renderElement"></div>
</template>

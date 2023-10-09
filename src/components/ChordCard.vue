<script setup lang="ts">
import { useSettingsStore } from "../store/useSettings";
import ChordScore from "./ChordScore.vue";

const settingStore = useSettingsStore();
const { settings } = settingStore;

interface Props {
    chord: Object;
    // isColorNoteNameEnable?: boolean;
    // isInterval: false;
    // isShowRoman: false;
    // chordTitleElement?: Element;
    // chordSubTitleElement?: Element;
    // originalElement?: Element;
}

const props = withDefaults(defineProps<Props>(), {
    chord: () => {},
    // isColorNoteNameEnable: false,
    // isInterval: false,
    // isShowRoman: false,
    // chordTitleElement: undefined,
    // chordSubTitleElement: undefined,
    // originalElement: undefined,
});
</script>

<template>
    <v-card :class="{ 'chord-dictionary-color-name': settings.isColorNoteName }" no-body>
        <template #title>
            <div v-html="chord.titleElement && chord.titleElement.innerHTML"></div>
        </template>
        <template v-show="chord.isInterval || settings.isShowRoman" #subtitle>
            <div v-html="chord.subtitleElement && chord.subtitleElement.innerHTML"></div>
        </template>
        <template #text>
            <div v-html="chord.originalElement && chord.originalElement.innerHTML"></div>
            <ChordScore :chord="chord" class="mt-0"></ChordScore>
        </template>
    </v-card>
</template>

<style scoped>
:deep(.chord-dictionary-note) {
    font-style: bold;
}
:deep(.chord-dictionary-chord) {
    color: #333;
    font-style: italic;
}
:deep(.chord-dictionary-slash) {
    color: #888;
    font-size: 80%;
}
:deep(.chord-dictionary-bass) {
    font-size: 80%;
}
:deep(.chord-dictionary-white) {
    font-style: bold;
}
:deep(.chord-dictionary-acci) {
    font-family: "FreeSerif";
    font-size: 115%;
    position: relative;
    bottom: 3px;
}
:deep(.chord-dictionary-part) {
    margin-right: 10px;
}

.chord-dictionary-color-name :deep(.chord-dictionary-midi-0) {
    color: hsl(0, 88%, 46%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-1) {
    color: hsl(30, 99%, 33%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-2) {
    color: hsl(49, 90%, 46%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-3) {
    color: hsl(60, 98%, 33%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-4) {
    color: hsl(79, 59%, 46%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-5) {
    color: hsl(135, 76%, 33%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-6) {
    color: hsl(172, 68%, 46%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-7) {
    color: hsl(191, 41%, 33%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-8) {
    color: hsl(273, 79%, 46%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-9) {
    color: hsl(291, 46%, 33%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-1)0 {
    color: hsl(295, 97%, 46%);
}
.chord-dictionary-color-name :deep(.chord-dictionary-midi-1)1 {
    color: hsl(332, 97%, 33%);
}
</style>

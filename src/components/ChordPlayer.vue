<script setup lang="ts">
import { onMounted, watch, getCurrentInstance } from "vue";
import { useSettingsStore } from "../store/useSettings";
import * as Tone from "tone";
import { INSTRUMENTS } from "../config/const.js";
import { Util } from "../utils/util";

const settingStore = useSettingsStore();
const { settings } = settingStore;

const instance = getCurrentInstance();

interface Props {
    isActive: boolean;
    chordName: string;
    chordVoicing: Array<number>;
}
const props = withDefaults(defineProps<Props>(), {
    isActive: true,
    chordName: "",
    chordVoicing: () => [],
});

const instruments = Object.fromEntries(
    INSTRUMENTS.map((value) => {
        const instrument = value.samples ? new Tone.Sampler(value.samples) : new Tone.PolySynth();
        return [value.key, instrument.toMaster()];
    })
);

watch(
    () => props.chordName,
    (newChordString, oldChordString) => {
        if (!settings.isActiveHover) return;

        if (!newChordString) return;

        if (newChordString === oldChordString) return;

        playChord();
    }
);

watch(settings, (val) => {
    Tone.Master.volume.value = Tone.gainToDb(val.vol);
});

onMounted(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("click", click);
});

const playChord = () => {
    if (!props.isActive || instance?.parent?.vnode?.el?.matches(":hover") || !props.chordVoicing)
        return;
    Tone.Transport.stop().cancel();
    try {
        instruments[settings.inst].releaseAll();
    } catch (e) {
        return;
    }

    props.chordVoicing.forEach((midi, index) => {
        Tone.Transport.scheduleOnce(
            (time: number) => {
                instruments[settings.inst].triggerAttack(Tone.Frequency(midi, "midi"), time);
            },
            (settings.isArpeggio ? 1 : 0) * settings.arpeggio * index
        );
    });
    Tone.Transport.scheduleOnce((time: number) => {
        try {
            instruments[settings.inst].releaseAll(time);
        } catch (e) {
            return;
        }
    }, settings.duration);

    Tone.Transport.start();
};

const keyDown = (event: KeyboardEvent) => {
    if (!settings.isActiveKey) return;
    if (Util.isMac() ? !event.metaKey : !event.ctrlKey) return;
    if (
        !event.shiftKey ||
        event.altKey ||
        event.repeat ||
        (event.which || event.keyCode || event.charCode) !== 32
    )
        return;
    playChord();
};

const click = () => {
    if (!settings.isActiveClick) return;
    playChord();
};
</script>

<!-- eslint-disable-next-line vue/valid-template-root -->
<template></template>

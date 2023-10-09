<script setup lang="ts">
import { onMounted, watch, reactive, getCurrentInstance } from "vue";
import { useSettingsStore } from "../store/useSettings";
import * as Tone from "tone";
import { INSTRUMENTS } from "../config/const.js";
import { util } from "../utils/util";

const settingStore = useSettingsStore();
const { settings } = settingStore;

const instance = getCurrentInstance();

const props = defineProps({
    isActive: Boolean,
    chord: Object,
});

const insts = reactive({});

onMounted(() => {
    INSTRUMENTS.forEach((v) => {
        insts[v.key] = (v.samples ? new Tone.Sampler(v.samples) : new Tone.PolySynth()).toMaster();
    });
    window.addEventListener("keydown", keyDown);
    window.addEventListener("click", click);
});

watch(
    () => props.chord.string,
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

const playChord = () => {
    if (!props.isActive || instance.parent.vnode.el.matches(":hover") || !props.chord.voicing)
        return;
    Tone.Transport.stop().cancel();
    try {
        insts[settings.inst].releaseAll();
    } catch (e) {}

    props.chord.voicing.forEach((midi, index) => {
        Tone.Transport.scheduleOnce((time) => {
            insts[settings.inst].triggerAttack(Tone.Frequency(midi, "midi"), time);
        }, settings.isArpeggio * settings.arpeggio * index);
    });
    Tone.Transport.scheduleOnce((time) => {
        try {
            insts[settings.inst].releaseAll(time);
        } catch (e) {}
    }, settings.duration);

    Tone.Transport.start();
};
const keyDown = (event) => {
    if (!settings.isActiveKey) return;
    if (util.isMac() ? !event.metaKey : !event.ctrlKey) return;
    if (
        !event.shiftKey ||
        event.altKey ||
        event.repeat ||
        (event.which || event.keyCode || event.charCode) !== 32
    )
        return;
    playChord();
};
const click = (event) => {
    if (!settings.isActiveClick) return;
    playChord();
};
</script>

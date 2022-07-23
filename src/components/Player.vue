<script setup>
import { onMounted, watch, reactive, getCurrentInstance } from "vue";
import Tone from "tone";
import { INSTS } from "../config/const.js";
import { util } from "../utils/util";

const instance = getCurrentInstance();

const props = defineProps({
    isActive: Boolean,
    showChord: Boolean,
    chord: Object,
    settings: Object,
});

const insts = reactive({});

onMounted(() => {
    INSTS.forEach((v) => {
        insts[v.key] = (
            v.samples ? new Tone.Sampler(v.samples) : new Tone.PolySynth(12)
        ).toMaster();
    });
    window.addEventListener("keydown", keyDown);
    window.addEventListener("click", click);
});

watch(props.showChord, () => {
    if (!props.settings.isActiveHover) return;
    playChord();
});
watch(props.settings, (val) => {
    Tone.Master.volume.value = Tone.gainToDb(val.vol);
});

const playChord = () => {
    if (!props.isActive || instance.proxy.$parent.$el.matches(":hover") || !props.chord.voicing)
        return;
    Tone.Transport.stop().cancel();
    try {
        insts[props.settings.inst].releaseAll();
    } catch (e) {}
    props.chord.voicing.forEach((midi, index) => {
        Tone.Transport.scheduleOnce((time) => {
            insts[props.settings.inst].triggerAttack(Tone.Frequency(midi, "midi"), time);
        }, props.settings.isArpeggio * props.settings.arpeggio * index);
    });
    Tone.Transport.scheduleOnce((time) => {
        try {
            insts[props.settings.inst].releaseAll(time);
        } catch (e) {}
    }, props.settings.duration);
    Tone.Transport.start();
};
const keyDown = (event) => {
    if (!props.settings.isActiveKey) return;
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
    if (!props.settings.isActiveClick) return;
    playChord();
};
</script>

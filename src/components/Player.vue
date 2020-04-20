<script>
import Tone from "tone";
import { INSTS } from "../config/const.js";

export default {
  name: "Player",
  props: {
    isActive: Boolean,
    chord: Object,
    settings: Object
  },
  data() {
    return {
      insts: {}
    };
  },
  watch: {
    chord: function(newVal, oldVal) {
      if (!this.settings.isActiveHover || newVal.string === oldVal.string) return false;
      this.playChord();
    },
    settings: {
      handler: function(val) {
        Tone.Master.volume.value = Tone.gainToDb(val.volume);
      },
      deep: true
    }
  },
  methods: {
    playChord: function() {
      if (!this.isActive || this.$parent.$el.matches(":hover") || !this.chord.voicing) return false;
      Tone.Transport.stop().cancel();
      try {
        this.insts[this.settings.inst].releaseAll();
      } catch (e) {}
      Tone.Transport.scheduleOnce(function(chord, time) {
        this.insts[this.settings.inst].triggerAttack(chord, time);
      }.bind(this, this.chord.voicing.map(midi => Tone.Frequency(midi, "midi"))), 0);
      Tone.Transport.scheduleOnce(function(time) {
        try {
          this.insts[this.settings.inst].releaseAll(time);
        } catch (e) {}
      }.bind(this), this.settings.duration);
      Tone.Transport.start();
    },
    keyDown: function(e) {
      if (!this.settings.isActiveKey) return false;
      if (window.navigator.platform.includes("Mac") ? !e.metaKey : !e.ctrlKey) return false;
      if (!e.shiftKey || e.altKey || e.repeat || (e.which || e.keyCode || e.charCode) !== 32) return false;
      this.playChord();
    },
    click: function(e) {
      if (!this.settings.isActiveClick) return false;
      this.playChord();
    }
  },
  mounted() {
    INSTS.forEach(function(v) {
      this.insts[v.key] = (v.samples ? new Tone.Sampler(v.samples) : new Tone.PolySynth()).toMaster();
    }.bind(this));
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("click", this.click);
  }
};
</script>
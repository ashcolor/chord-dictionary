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
      insts: []
    };
  },
  watch: {
    chord: function(newVal, oldVal) {
      if (!this.isActive || !this.settings.isActiveHover) return false;
      if (newVal.string === oldVal.string) return false;
      this.playChord();
    }
  },
  methods: {
    playChord: function() {
      if (this.$parent.$el.matches(":hover") || !this.chord.voicing) return false;
      this.insts[this.settings.inst].volume.value = Tone.gainToDb(
        this.settings.volume / 100
      );
      this.insts[this.settings.inst].releaseAll();
      this.insts[this.settings.inst].triggerAttackRelease(
        this.chord.voicing.map(midi => Tone.Frequency(midi, "midi")),
        1.5
      );
    },
    keyDown: function(e) {
      if (!this.isActive || !this.settings.isActiveKey) return false;
      if (!e.ctrlKey && !e.metaKey || e.keyCode !== 32) return false;
      this.playChord();
    },
    click: function(e) {
      if (!this.isActive || !this.settings.isActiveClick) return false;
      this.playChord();
    }
  },
  mounted() {
    INSTS.forEach(
      function(v) {
        this.insts[v.key] = (v.isSample ? new Tone.Sampler(v.samples) : new Tone.PolySynth()).toMaster();
      }.bind(this)
    );
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("click", this.click);
  }
};
</script>
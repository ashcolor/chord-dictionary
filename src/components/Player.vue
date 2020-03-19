<script>
import Tone from "tone";
import { INSTS } from "../config/const.js";

export default {
  name: "Player",
  props: {
    isActive: Boolean,
    chordVoicing: Array,
    settings: Object
  },
  data() {
    return {
      insts: [],
      instSynth: new Tone.PolySynth().toMaster()
    };
  },
  watch: {
    chordVoicing: function() {
      if (!this.isActive) return false;
      if (!this.settings.isActiveHover) return false;
      this.playChord();
    }
  },
  methods: {
    playChord: function() {
      if (!this.chordVoicing.length) return false;
      this.insts[this.settings.inst].volume.value = Tone.gainToDb(this.settings.volume / 100);
      this.insts[this.settings.inst].releaseAll();
      this.insts[this.settings.inst].triggerAttackRelease(this.chordVoicing.map(midi => Tone.Frequency(midi, "midi")), 1.8);
      /*
      const part = new Tone.Part(
        function setPlay(time, note) {
          this.insts[this.settings.inst].triggerAttackRelease(note, "2n", time);
        }.bind(this),
        [["0:0:0", this.chordVoicing.map(midi => Tone.Frequency(midi, "midi"))]]
      ).start();
      Tone.Transport.start();
      */
    },
    keyDown: function(e) {
      if (!this.isActive) return false;
      if (!this.settings.isActiveKey) return false;
      if (!e.ctrlKey && !e.metaKey) return false;
      if (e.keyCode === 32) {
        this.playChord();
      }
    },
    click: function(e) {
      if (!this.isActive) return false;
      if (!this.settings.isActiveClick) return false;
      this.playChord();
    }
  },
  mounted() {
    INSTS.forEach(
      function(v) {
        if (v.isSample) {
          this.insts[v.key] = new Tone.Sampler(v.samples).toMaster();
        } else {
          this.insts[v.key] = new Tone.PolySynth().toMaster();
        }
      }.bind(this)
    );
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("click", this.click);
  }
};
</script>
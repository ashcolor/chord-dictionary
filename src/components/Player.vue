<script>
import Tone from "tone";
import { INSTS } from "../config/const.js";

export default {
  name: "Player",
  props: {
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
    chordVoicing: function(n, o) {
      if (!this.settings.isActiveHover) return false;
      this.playChord();
    }
  },
  methods: {
    playChord: function() {
      if (this.chordVoicing.length === 0) return false;
      const chordMelody = [["0:0:0", this.chordVoicing]];
      console.log(this.settings.inst);
      new Tone.Part(
        function setPlay(time, note) {
          this.insts[this.settings.inst].triggerAttackRelease(
            note,
            Tone.Time("4n") * 2,
            time
          );
        }.bind(this),
        chordMelody
      ).start();
      Tone.Transport.start();
    },
    keyDown: function(e) {
      if (!this.settings.isActiveKey) return false;
      if (!e.ctrlKey && !e.metaKey) return false;
      if (e.keyCode === 32) {
        this.playChord();
      }
    },
    click: function(e) {
      if (!this.settings.isActiveClick) return false;
      this.playChord();
    }
  },
  mounted() {
    INSTS.forEach(
      function(v) {
        this.insts[v.key] = new Tone.Sampler(v.samples).toMaster();
      }.bind(this)
    );
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("click", this.click);
  }
};
</script>
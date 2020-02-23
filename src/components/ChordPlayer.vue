<template>
  <div class="text-muted">
    <p class="small">※コードを再生する</p>
    <p class="small">(Win) Ctrl + Space</p>
    <p class="small">(Mac) Cmd + Shift + Space</p>
  </div>
</template>

<script>
import Tone from "tone";
import { Note } from "tonal";

export default {
  name: "ChordPlayer",
  data() {
    return {
      instSynth: new Tone.PolySynth().toMaster(),
      instPiano: null
    };
  },
  props: {
    chordList: Array
  },
  methods: {
    playChord: function(e) {
      if (!e.ctrlKey && !e.metaKey) return false;
      if (e.keyCode === 32) {
        const chordList = this.chordList.map(v =>
          Note.simplify(v.replace("/", ""))
        );
        const chordMelody = [["0:0:0", chordList]];
        new Tone.Part(
          function setPlay(time, note) {
            this.instPiano.triggerAttackRelease(
              note,
              Tone.Time("4n") * 2,
              time
            );
          }.bind(this),
          chordMelody
        ).start();
        Tone.Transport.start();
      }
    }
  },
  mounted() {
    let SAMPLE_BASE;
    let PIANO_SAMPLE;
    if (location.protocol === "file:") {
      SAMPLE_BASE = "https://storage.googleapis.com/chord-dictionary/sound/";
      PIANO_SAMPLE = {
        C1: "piano-c2.mp3",
        C2: "piano-c3.mp3",
        C3: "piano-c4.mp3",
        C4: "piano-c5.mp3",
        C5: "piano-c6.mp3"
      };
    } else {
      SAMPLE_BASE = "";
      PIANO_SAMPLE = {
        C1: chrome.extension.getURL("sounds/piano-c2.mp3"),
        C2: chrome.extension.getURL("sounds/piano-c3.mp3"),
        C3: chrome.extension.getURL("sounds/piano-c4.mp3"),
        C4: chrome.extension.getURL("sounds/piano-c5.mp3"),
        C5: chrome.extension.getURL("sounds/piano-c6.mp3")
      };
    }
    this.instPiano = new Tone.Sampler(PIANO_SAMPLE, {
      baseUrl: SAMPLE_BASE,
      onload: function() {
        console.log("[chord-dictionary] sounds loaded");
      }
    }).toMaster();
    window.removeEventListener("keydown", this.playChord);
    window.addEventListener("keydown", this.playChord);
  }
};
</script>

<style scoped>
p {
  margin: 0;
}
.small {
  font-size: 80%;
  font-weight: 400;
}
.text-muted {
  color: #6c757d !important;
}
</style>

<template>
  <p>[Ctrl] + [Space] で再生</p>
</template>

<script>
import Tone from "tone";

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
    playChord: function() {
      console.log(this.chordList);
      const chordMelody = [["0:0:0", this.chordList]];
      new Tone.Part(
        function setPlay(time, note) {
          this.instPiano.triggerAttackRelease(note, Tone.Time("4n") * 2, time);
        }.bind(this),
        chordMelody
      ).start();
      Tone.Transport.start();
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
        console.log("loaded");
      }
    }).toMaster();

    window.addEventListener(
      "keydown",
      function(e) {
        if (!event.ctrlKey) return false;
        if (e.keyCode === 32) this.playChord();
      }.bind(this)
    );
  }
};
</script>

<style scoped>
</style>

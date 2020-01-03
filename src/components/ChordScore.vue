<template>
  <div id="score"></div>
</template>

<script>
// import { Note } from "tonal"
import Vex from "vexflow";

export default {
  name: "ChordScore",
  props: {
    chordList: Array
  },
  watch: {
    chordList: function(val) {
      this.dispScore(val);
    }
  },
  methods: {
    dispScore: chordList => {
      const VF = Vex.Flow;

      const div = document.getElementById("score");
      if (div === null) return false;
      div.textContent = null;

      const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
      renderer.resize(150, 80);
      const context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");
      const stave = new VF.Stave(0, -25, 100);
      stave.addClef("treble");
      stave.setContext(context).draw();

      if (typeof chordList !== "object") return false;
      if (!chordList.length > 0) return false;

      //♭と♯の判定
      // const acc;

      // if (this.chordName.indexOf("#") != -1) {
      //   console.log("#");
      //   acc = true;
      // } else if (this.chordName.indexOf("b") != -1) {
      //   console.log("b");
      //   acc = false;
      // } else {
      //   console.log("else");
      //   const sharpRegex = /^D|E|G|A|B/;
      //   let pattern = new RegExp(sharpRegex);
      //   if (this.chordName.match(pattern) === null) {
      //     acc = false;
      //   } else {
      //     acc = true;
      //   }
      // }

      const parsedChordList = chordList.map(e => {
        const note = e.substring(0, e.length - 1);
        // if (acc === true) {
        //   note = Note.simplify(note, false);
        //   console.log(note);
        // }
        const pitch = parseInt(e.slice(-1), 10) + 1;
        const chord = note + "/" + pitch.toString();
        return chord;
      });

      const notes = [
        new VF.StaveNote({ keys: parsedChordList, duration: "w" })
      ];

      parsedChordList.forEach((note, index) => {
        if (note.indexOf("#") != -1) {
          notes[0].addAccidental(index, new VF.Accidental("#"));
        } else if (note.indexOf("b") != -1) {
          notes[0].addAccidental(index, new VF.Accidental("b"));
        }
      });

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables(notes);
      new VF.Formatter().joinVoices([voice]).format([voice], 800);
      voice.draw(context, stave);
    }
  }
};
</script>

<style scoped>
#score {
  margin-top: 10px;
  height: 80px;
}
</style>

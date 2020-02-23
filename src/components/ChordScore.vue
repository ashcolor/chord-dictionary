<template>
  <div id="score"></div>
</template>

<script>
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
      renderer.resize(150, 120);
      const context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");
      const stave = new VF.Stave(0, -5, 120);
      stave.addClef("treble");
      stave.setContext(context).draw();

      if (typeof chordList !== "object") return false;
      if (!chordList.length > 0) return false;

      const notes = [new VF.StaveNote({ keys: chordList, duration: "w" })];

      chordList.forEach((note, index) => {
        if (note.indexOf("##") != -1) {
          notes[0].addAccidental(index, new VF.Accidental("##"));
        } else if (note.indexOf("bb") != -1) {
          notes[0].addAccidental(index, new VF.Accidental("bb"));
        } else if (note.indexOf("#") != -1) {
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
  height: 100px;
}
</style>

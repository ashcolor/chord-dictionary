<template>
  <div id="score"></div>
</template>

<script>
import Vex from "vexflow";

export default {
  name: "ChordScore",
  props: {
    chordObject: Object
  },
  watch: {
    chordObject: function(val) {
      if (val) this.dispScore(val);
    }
  },
  methods: {
    dispScore: chordObject => {
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

      const notes = new VF.StaveNote({ keys: chordObject.display, duration: "w" });

      chordObject.original.forEach((note, index) => {
        if (note.offset) notes.addAccidental(index, new VF.Accidental(note.offset < 0 ? "b".repeat(-note.offset) : "#".repeat(note.offset)));
      });

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables([notes]);
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

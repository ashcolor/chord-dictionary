<template>
  <div id="chord-dictionary-score"></div>
</template>

<script>
import Vex from "vexflow";

export default {
  name: "ChordScore",
  props: {
    chordObject: Object
  },
  data() {
    return {
      offsetH: 0
    };
  },
  watch: {
    chordObject: function(val) {
      this.dispScore(val);
    }
  },
  mounted() {
    this.dispScore(this.chordObject);
  },
  methods: {
    dispScore: function(chordObject) {
      if (this.chordObject.display === undefined) return;
      const div = document.getElementById("chord-dictionary-score");
      div.textContent = null;

      const width = 120;
      const height = 100;

      const VF = Vex.Flow;
      const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
      const context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#fff");
      const stave = new VF.Stave(0, 0, width);
      stave.addClef("treble");
      stave.setContext(context);

      const notes = new VF.StaveNote({
        keys: chordObject.display,
        duration: "w"
      });

      chordObject.original.forEach((note, index) => {
        if (note.offset)
          notes.addAccidental(
            index,
            new VF.Accidental(
              note.offset < 0
                ? "b".repeat(-note.offset)
                : "#".repeat(note.offset)
            )
          );
      });

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables([notes]);
      new VF.Formatter().joinVoices([voice]).format([voice]);
      voice.setStave(stave);

      //音符の描画位置が高すぎる場合の調整
      const y = voice.getBoundingBox().y;
      this.offsetH = y < 10 ? 10 - y : 0;
      renderer.resize(width + 20, height + this.offsetH);
      stave.setY(this.offsetH);

      stave.draw();
      voice.draw(context, stave);
    }
  }
};
</script>
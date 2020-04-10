<template>
  <div id="chord-dictionary-score"></div>
</template>

<script>
import Vex from "vexflow";

export default {
  name: "ChordScore",
  props: {
    chord: Object
  },
  data() {
    return {
      width: 0,
      offsetH: 0
    };
  },
  watch: {
    chord: function(newVal, oldVal) {
      if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return false;
      this.dispScore();
    }
  },
  mounted() {
    this.dispScore();
  },
  methods: {
    dispScore: function() {
      if (!this.chord || !this.chord.display) return;
      const div = document.getElementById("chord-dictionary-score");
      div.textContent = null;

      const VF = Vex.Flow;
      const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
      const context = renderer.getContext();
      context.setFont("Bravura", 10, "").setBackgroundFillStyle("transparent");
      const stave = new VF.Stave(0, 0, 0);
      stave.addClef("treble");
      stave.setContext(context);

      const notes = new VF.StaveNote({
        keys: this.chord.display,
        duration: "w"
      });

      this.chord.original.forEach((note, index) => {
        if (note.offset) {
          const acci = note.offset < 0 ? "bb" : "##", repetition = Math.abs(note.offset) >> 1;
		  for (var i = 0; i < repetition; i++) notes.addAccidental(
            index,
            new VF.Accidental(acci)
          );
          if (note.offset & 1) notes.addAccidental(
            index,
            new VF.Accidental(note.offset < 0 ? "b" : "#")
          );
        }
      });

      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      voice.addTickables([notes]);
      new VF.Formatter().joinVoices([voice]).format([voice]);
      voice.setStave(stave);

      //音符の描画位置が高すぎる場合の調整
      const box = voice.getBoundingBox();
      this.width = box.w + 65;
      this.offsetH = box.y < 10 ? 10 - box.y : 0;
      renderer.resize(20 + this.width, 100 + this.offsetH);
      stave.setWidth(this.width);
      stave.setY(this.offsetH);

      stave.draw();
      voice.draw(context, stave);
    }
  }
};
</script>
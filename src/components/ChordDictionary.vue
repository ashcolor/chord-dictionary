<template>
  <div
    id="pop-up"
    class="card"
    v-show="is_chord"
    :style="{ top: position.top + 'px' , left: position.left + 'px' }"
  >
    <div class="card-header">
      <chord-name :chordName="chordName"></chord-name>
    </div>
    <div class="card-body">
      <chord-list :chordList="chordList"></chord-list>
      <chord-score :chordList="chordList"></chord-score>
    </div>
    <chord-player :chordList="chordList"></chord-player>
  </div>
</template>

<script>
import $ from "jquery";
import "bootstrap";
import chordTranslator from "chord-translator";
import ChordName from "./ChordName.vue";
import ChordList from "./ChordList.vue";
import ChordScore from "./ChordScore.vue";
import ChordPlayer from "./ChordPlayer.vue";

export default {
  name: "ChordDictionary",
  components: {
    ChordName,
    ChordList,
    ChordScore,
    ChordPlayer
  },
  data() {
    return {
      chordName: "",
      position: {
        top: 0,
        left: 0
      }
    };
  },
  computed: {
    chordList() {
      return this.textToChord(this.chordName);
    },
    is_chord() {
      return this.chordName !== "";
    }
  },

  methods: {
    textToChord(text) {
      if (typeof text !== "string") return [];
      text = text.replace(/♯/, "#");
      text = text.replace(/♭/, "b");
      const rootChordRegex = /^C#|Db|D#|Eb|F#|Gb|G#|Ab|A#|Bb|C|D|E|F|G|A|B/;
      const pattern = new RegExp(rootChordRegex);
      const rootChord = text.match(pattern);
      const typeChord = text.replace(rootChord, "");
      if (rootChord === null) return [];
      const chordList = chordTranslator(rootChord, typeChord);
      if (chordList === false) return [];
      return chordList;
    },
    getPointedWord(e) {
      let range;
      let textNode;
      if (document.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (!range) return "";
        textNode = range.offsetNode;
      } else if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!range) return "";
        textNode = range.startContainer;
      }
      if (!textNode) return "";
      if (textNode.nodeType !== 3) return "";
      if (range === null) return "";
      if (range.startContainer.nodeType !== Node.TEXT_NODE) return "";

      //@https://javascript.g.hatena.ne.jp/edvakf/20110213/1297636186
      let t = range.startContainer;
      let start = range.startOffset;
      let end = start;

      while (start > 0) {
        start -= 1;
        range.setStart(t, start);
        if (/^\s/.test(range.toString())) {
          range.setStart(t, (start += 1));
          break;
        }
      }
      let l = t.nodeValue.length;
      while (end < l) {
        end += 1;
        range.setEnd(t, end);
        if (/\s$/.test(range.toString())) {
          range.setEnd(t, (end -= 1));
          break;
        }
      }
      return range.toString().trim();
    }
  },
  mounted() {
    window.addEventListener(
      "mousemove",
      function(e) {
        const event = e || window.event; // IE対応
        this.position.top = event.pageY;
        this.position.left = event.pageX;
        const word = this.getPointedWord(event);

        if (this.chordName === word) return false;
        if (!this.textToChord(word).length > 0) {
          this.chordName = "";
          return false;
        }
        this.chordName = word;
      }.bind(this)
    );
  }
};
</script>

<style scoped>
/* bootstrap */
.card {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.card-body {
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  padding: 1.25rem;
}

.card-footer {
  padding: 0.75rem 1.25rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

/* user */
div#chordPlayer-config {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 20%;
  background: white;
}

#pop-up {
  z-index: 1000;
  position: absolute !important;
}
</style>

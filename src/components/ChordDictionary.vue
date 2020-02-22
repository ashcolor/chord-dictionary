<template>
  <div id="pop-up" class="card" :style="{ top: position.top + 'px' , left: position.left + 'px' }">
    <div class="card-header">
      <chord-name :chordName="chordName" />
    </div>
    <div class="card-body">
      <chord-list :chordList="chordList" :chordOriginal="chordOriginal" />
      <chord-score :chordList="chordList" />
    </div>
    <div class="card-footer">
      <chord-player :chordList="chordList" />
    </div>
  </div>
</template>

<script>
import ChordNote from "../assets/ChordNote_for_chord-dictionary.js";
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
      text: "",
      position: {
        top: 0,
        left: 0
      }
    };
  },
  computed: {
    chordNote() {
      return ChordNote.parseContent(this.text);
    },
    chordName() {
      return this.chordNote.length > 0 ? this.chordNote[0].string : "";
    },
    chordOriginal() {
      return this.chordNote.length > 0 ? this.chordNote[0].original : [];
    },
    chordList() {
      return this.chordNote.length > 0 ? this.chordNote[0].display : [];
    }
  },
  methods: {
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
    this.chordName = "";
    window.addEventListener(
      "mousemove",
      function(e) {
        this.position.top = e.pageY + 20;
        this.position.left = e.pageX + 20;
        this.text = this.getPointedWord(event);
      }.bind(this)
    );
  }
};
</script>

<style scoped>
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
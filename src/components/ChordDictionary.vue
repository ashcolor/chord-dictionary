<template>
  <div>
    <b-card-group
      deck
      id="pop-up"
      :style="{ top: position.top + 'px' , left: position.left + 'px' }"
    >
      <b-card :header="chordName" title-tag="h3" no-body>
        <b-card-body>
          <b-card-text>{{chordOriginal | chordOriginalToString}}</b-card-text>
          <score :chordDisplay="chordDisplay" />
        </b-card-body>
      </b-card>
    </b-card-group>
    <player :chordVoicing="chordVoicing" :settings="settings" />
    <config
      :settings="settings"
      v-on:toggleClick="onToggleClick"
      v-on:toggleKey="onToggleKey"
      v-on:toggleHover="onToggleHover"
    />
  </div>
</template>

<script>
import ChordNote from "../assets/ChordNote_for_chord-dictionary.js";
import Score from "./Score.vue";
import Player from "./Player.vue";
import Config from "./Config.vue";

export default {
  name: "ChordDictionary",
  components: {
    Score,
    Player,
    Config
  },
  filters: {
    chordOriginalToString: value => {
      value = value.map(v =>
        ChordNote.Note(v.key, v.offset).toString(true, true)
      );
      return value.join(" ");
    }
  },
  data() {
    return {
      text: "",
      position: {
        top: 0,
        left: 0
      },
      settings: {
        key: "C",
        transpose: 0,
        inst: "piano",
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false
      }
    };
  },
  computed: {
    chordNote() {
      ChordNote.parseContent.intervalNote = this.settings.key;
      ChordNote.parseContent.transposeTo = this.settings.transpose;
      console.log(ChordNote.parseContent(this.text));
      return ChordNote.parseContent(this.text);
    },
    chordName() {
      return this.chordNote.length > 0 ? this.chordNote[0].string : " ";
    },
    chordOriginal() {
      return this.chordNote.length > 0 ? this.chordNote[0].original : [];
    },
    chordDisplay() {
      return this.chordNote.length > 0 ? this.chordNote[0].display : [];
    },
    chordVoicing() {
      return this.chordNote.length > 0 ? this.chordNote[0].voicing : [];
    }
  },
  watch: {
    settings: {
      handler: function(newValue, oldValue) {
        chrome.storage.local.set({ settings: newValue }, function() {
          console.log("[chord-dictionary] settings saved");
        });
      },
      deep: true
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
    },
    onToggleClick: function() {
      this.settings.isActiveClick = !this.settings.isActiveClick;
    },
    onToggleKey: function() {
      this.settings.isActiveKey = !this.settings.isActiveKey;
    },
    onToggleHover: function() {
      this.settings.isActiveHover = !this.settings.isActiveHover;
    }
  },
  mounted() {
    chrome.storage.local.get(
      "settings",
      function(value) {
        if (!value) return false;
        this.settings = value.settings;
      }.bind(this)
    );
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

<style lang="scss" scoped>
#pop-up {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";
  z-index: 1000;
  position: absolute !important;
  .card-header div {
    min-height: 24px;
  }
  .card-body p.card-text {
    min-width: 160.24px;
    min-height: 24.277px;
  }
}
</style>
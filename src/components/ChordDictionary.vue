<template>
  <div v-show="isActive">
    <b-card-group
      deck
      id="pop-up"
      v-show="note.isAvailable"
      :style="{ top: position.top + 'px' , left: position.left + 'px' }"
    >
      <b-card no-body>
        <b-card-header>
          <b-card-title class="mb-0" title-tag="h6">{{note | toName}}</b-card-title>
          <b-card-sub-title
            class="mt-2 mb-0"
            v-if="settings.isShowRoman"
          >{{this.settings.key | toRoman(note)}}</b-card-sub-title>
        </b-card-header>
        <b-card-body>
          <b-card-text class="mb-0">{{note.original | chordOriginalToString}}</b-card-text>
          <score :chordDisplay="note.display" class="mt-0" />
        </b-card-body>
      </b-card>
    </b-card-group>
    <player :isActive="isActive" :chordVoicing="note.voicing" :settings="settings" />
    <config
      :settings="settings"
      v-on:toggleShow="onButtonShow"
      v-on:toggleRoman="onToggleRoman"
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
    },
    toName: note => {
      return note.isInterval ? note.noteKey + note.name : note.string;
    },
    toRoman: (key, note) => {
      if (note.length === 0) return "";
      if (note.isInterval) return note.noteString + note.name;
      let name =
        ChordNote.transpose(key, note.noteString).toRoman() + note.name;
      if (note["onString"] !== undefined) {
        name += note.onString;
      }
      if (note["onNoteInterval"] !== undefined) {
        name += note.onNoteInterval;
      }
      return name;
    }
  },
  data() {
    return {
      isActive: true,
      text: "",
      position: {
        top: 0,
        left: 0
      },
      settings: {
        isShow: true,
        key: "C",
        transpose: 0,
        gain: -5,
        inst: "piano",
        isShowRoman: false,
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false
      }
    };
  },
  computed: {
    note() {
      ChordNote.parseContent.intervalNote = this.settings.key;
      // ChordNote.parseContent.transposeTo = this.settings.transpose;
      let object = [];
      let notes = ChordNote.parseContent(this.text);
      // console.log(notes);
      if (notes.length > 0) {
        object = notes[0];
        object["isAvailable"] = true;
      } else {
        object["isAvailable"] = false;
        object["string"] = "";
        object["name"] = "";
        object["noteString"] = "";
        object["isInterval"] = false;
        object["noteKey"] = "";
        object["original"] = [];
        object["firstIndex"] = 0;
        object["display"] = [];
        object["voicing"] = [];
      }
      return object;
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
      // console.log(range.toString().trim());
      return range.toString().trim();
    },
    onButtonShow: function() {
      this.settings.isShow = !this.settings.isShow;
    },
    onToggleRoman: function() {
      this.settings.isShowRoman = !this.settings.isShowRoman;
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
    chrome.runtime.onMessage.addListener(object => {
      this.isActive = object.isActive;
    });
    chrome.storage.local.get(
      "settings",
      function(value) {
        if (!value) return false;
        this.settings = Object.assign(this.settings, value.settings);
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
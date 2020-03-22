<template>
  <div v-show="isActive">
    <b-card-group
      v-if="chord"
      id="chord-dictionary-pop-up"
      :style="{ top: position.top + 'px' , left: position.left + 'px' }"
      deck
    >
      <b-card no-body>
        <b-card-header>
          <b-card-title
            title-tag="h6"
            v-html="chord.titleElement && chord.titleElement.innerHTML"
            class="mb-0"
          />
          <b-card-sub-title
            v-if="chord.isInterval || settings.isShowRoman"
            v-html="chord.subtitleElement && chord.subtitleElement.innerHTML"
            class="mt-2 mb-0"
          />
        </b-card-header>
        <b-card-body>
          <b-card-text
            v-html="chord.originalElement && chord.originalElement.innerHTML"
            class="mb-0"
          />
          <score :chordObject="chord" class="mt-0" />
        </b-card-body>
      </b-card>
    </b-card-group>
    <player :isActive="isActive" :chordVoicing="chord ? chord.voicing : {}" :settings="settings" />
    <div
      v-show="chord"
      id="chord-dictionary-highlight"
      :style="{ top: highlightPos.top + 'px' , left: highlightPos.left + 'px' , width: highlightPos.width + 'px' , height: highlightPos.height + 'px' }"
    />
    <config :settings="settings" />
  </div>
</template>

<script>
import ChordNote from "../assets/ChordNote.js";
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
  data() {
    return {
      isActive: true,
      chord: {},
      settings: {
        isShow: true,
        key: null,
        transpose: null,
        volume: 70,
        inst: "piano",
        isShowRoman: false,
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false
      },
      position: {
        top: 0,
        left: 0
      },
      range: null,
      textNode: null,
      highlightPos: {
        top: 0,
        left: 0,
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    setPointedChord: function(e) {
      if (document.caretPositionFromPoint) {
        this.range = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (!this.range) return;
        this.textNode = this.range.offsetNode;
      } else if (document.caretRangeFromPoint) {
        this.range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!this.range) return;
        this.textNode = this.range.startContainer;
      } else return;
      if (!this.textNode || this.textNode.nodeType !== 3) return;
      this.setChord(this.textNode.nodeValue, this.range.startOffset);
    },
    setChord: function(text, offset = 0) {
      ChordNote.parseContent.intervalNote = ChordNote.Note(
        this.settings.key,
        this.settings.offset
      );
      ChordNote.parseContent.transposeTo = ChordNote.Note(
        this.settings.transposeKey,
        this.settings.transposeOffset
      );
      this.chord = ChordNote.parseContent(text, offset);
    }
  },
  watch: {
    chord: function(val) {
      if (val) {
        this.range.setStart(this.textNode, val.position);
        this.range.setEnd(this.textNode, val.position + val.string.length);
        this.highlightPos = this.range.getBoundingClientRect();
        document.body.style.cursor = "help";
      } else {
        document.body.style.cursor = "";
      }
    }
  },
  mounted() {
    ChordNote.Note.useUnicode = true;
    ChordNote.Note.useDouble = true;
    ChordNote.Note.romanUseUnicode = true;
    ChordNote.Note.romanUseLowerCase = false;

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
        this.position.top = e.pageY + 16;
        this.position.left = e.pageX + 16;
        this.setPointedChord(e);
      }.bind(this)
    );
  }
};
</script>

<style lang="scss" scoped>
#chord-dictionary-pop-up {
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
#chord-dictionary-highlight {
  position: absolute;
  z-index: -1000;
  background-color: yellow;
}
</style>
<style>
.chord-dictionary-note {
  font-style: bold;
}
.chord-dictionary-chord {
  color: #333;
  font-style: italic;
}
.chord-dictionary-slash {
  color: #888;
  font-size: 80%;
}
.chord-dictionary-bass {
  font-size: 80%;
}
.chord-dictionary-part {
  margin-right: 10px;
}

.chord-dictionary-midi-0 {
  color: hsl(0, 88%, 46%);
}
.chord-dictionary-midi-1 {
  color: hsl(30, 99%, 33%);
}
.chord-dictionary-midi-2 {
  color: hsl(49, 90%, 46%);
}
.chord-dictionary-midi-3 {
  color: hsl(60, 98%, 33%);
}
.chord-dictionary-midi-4 {
  color: hsl(79, 59%, 46%);
}
.chord-dictionary-midi-5 {
  color: hsl(135, 76%, 33%);
}
.chord-dictionary-midi-6 {
  color: hsl(172, 68%, 46%);
}
.chord-dictionary-midi-7 {
  color: hsl(191, 41%, 33%);
}
.chord-dictionary-midi-8 {
  color: hsl(273, 79%, 46%);
}
.chord-dictionary-midi-9 {
  color: hsl(291, 46%, 33%);
}
.chord-dictionary-midi-10 {
  color: hsl(295, 97%, 46%);
}
.chord-dictionary-midi-11 {
  color: hsl(332, 97%, 33%);
}
</style>
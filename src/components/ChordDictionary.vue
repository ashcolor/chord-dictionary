<template>
  <div v-show="isActive">
    <b-card-group
      v-if="chord"
      id="chord-dictionary-pop-up"
      :style="position"
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
            v-show="chord.isInterval || settings.isShowRoman"
            v-html="chord.subtitleElement && chord.subtitleElement.innerHTML"
            class="mt-2 mb-0"
          />
        </b-card-header>
        <b-card-body>
          <b-card-text
            v-html="chord.originalElement && chord.originalElement.innerHTML"
            class="mb-0"
          />
          <score :chord="chord" class="mt-0" />
        </b-card-body>
      </b-card>
    </b-card-group>
    <player :isActive="isActive" :chord="chord" :settings="settings" />
    <div
      v-show="chord"
      id="chord-dictionary-highlight"
      :style="highlightPos"
    />
    <setting :settings="settings" />
  </div>
</template>

<script>
import ChordNote from "../assets/ChordNote.js";
import Score from "./Score.vue";
import Player from "./Player.vue";
import Setting from "./setting.vue";

var offsetBase = document.createElement("div");
offsetBase.style.position = "absolute";
offsetBase.style.top = 0;
offsetBase.style.left = 0;
document.body.appendChild(offsetBase);

export default {
  name: "ChordDictionary",
  components: {
    Score,
    Player,
    Setting
  },
  data() {
    return {
      isActive: true,
      chord: null,
      settings: {
        isShow: null,
        language: null,
        key: 0,
        offset: 0,
        isTranspose: false,
        transposeKey: 0,
        transposeOffset: 0,
        volume: 70,
        inst: "piano",
        isShowRoman: false,
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false
      },
      position: {},
      range: null,
      textNode: null,
      highlightPos: {}
    };
  },
  watch: {
    chord: function(val) {
      if (!val) return false;
      this.range.setStart(this.textNode, val.position);
      this.range.setEnd(this.textNode, val.position + val.string.length);
      var rangeRect = this.range.getBoundingClientRect();
      var offsetRect = offsetBase.getBoundingClientRect();
      this.highlightPos = {
        top: rangeRect.top - offsetRect.top + "px",
        left: rangeRect.left - offsetRect.left + "px",
        width: rangeRect.width + "px",
        height: rangeRect.height + "px"
      };
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
        if (value) this.settings = Object.assign(this.settings, value.settings);
        this.settings.language = this.settings.language || (function(languages) {
          for (var i = 0; i < languages.length; i++) {
            if (!languages[i]) continue;
            if (/^zh-(hk|mo)/i.test(languages[i])) return "hk";
            if (/^zh-(tw|hant)/i.test(languages[i])) return "tw";
            if (/^zh/i.test(languages[i])) return "cn";
            if (/^ja/i.test(languages[i])) return "ja";
            if (/^ko/i.test(languages[i])) return "ko";
            if (/^en/i.test(languages[i])) return "en";
          }
          return "en";
        })([].concat(window.navigator.language, window.navigator.userLanguage, window.navigator.browserLanguage, window.navigator.systemLanguage, window.navigator.languages));
        if (this.settings.isShow === null) this.settings.isShow = true;
      }.bind(this)
    );
    window.addEventListener(
      "mousemove",
      function(e) {
        this.position.top = e.pageY + 16 + "px";
        this.position.left = e.pageX + 16 + "px";
        this.setPointedChord(e);
      }.bind(this)
    );
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
      if (!this.textNode || this.textNode.nodeType !== 3 || this.$el.contains(this.textNode)) return;
      ChordNote.parseContent.intervalNote = ChordNote.Note(
        this.settings.key,
        this.settings.offset
      );
      ChordNote.parseContent.transposeTo = ChordNote.Note(
        this.settings.isTranspose && this.settings.transposeKey,
        this.settings.isTranspose && this.settings.transposeOffset
      );
      this.chord = ChordNote.parseContent(this.textNode.nodeValue, this.range.startOffset);
    }
  }
};
</script>

<style lang="scss" scoped>
#chord-dictionary-wrapper #chord-dictionary-pop-up {
  @import "node_modules/bootstrap/scss/bootstrap";
  @import "node_modules/bootstrap-vue/src/index.scss";
  text-align: left;
  position: absolute !important;
  z-index: 2147483647;
}
#chord-dictionary-wrapper #chord-dictionary-highlight {
  position: absolute;
  background-color: yellow;
  z-index: -2147483648;
}
</style>
<style>
#chord-dictionary-wrapper .chord-dictionary-note {
  font-style: bold;
}
#chord-dictionary-wrapper .chord-dictionary-chord {
  color: #333;
  font-style: italic;
}
#chord-dictionary-wrapper .chord-dictionary-slash {
  color: #888;
  font-size: 80%;
}
#chord-dictionary-wrapper .chord-dictionary-bass {
  font-size: 80%;
}
#chord-dictionary-wrapper .chord-dictionary-part {
  margin-right: 10px;
}
#chord-dictionary-wrapper .chord-dictionary-midi-0 {
  color: hsl(0, 88%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-1 {
  color: hsl(30, 99%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-2 {
  color: hsl(49, 90%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-3 {
  color: hsl(60, 98%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-4 {
  color: hsl(79, 59%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-5 {
  color: hsl(135, 76%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-6 {
  color: hsl(172, 68%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-7 {
  color: hsl(191, 41%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-8 {
  color: hsl(273, 79%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-9 {
  color: hsl(291, 46%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-10 {
  color: hsl(295, 97%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-midi-11 {
  color: hsl(332, 97%, 33%);
}
</style>
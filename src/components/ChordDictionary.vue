<template>
  <div v-show="isActive">
    <b-card-group
      v-if="showChord && chord.string"
      id="chord-dictionary-pop-up"
	  v-bind:class="{ 'chord-dictionary-color-name': settings.isColorNoteName }"
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
          <score :chord="chord" :settings="settings" @updated="updated" class="mt-0" />
        </b-card-body>
      </b-card>
    </b-card-group>
    <player :isActive="isActive" :showChord="showChord" :chord="chord" :settings="settings" />
    <div
      v-show="chord.string"
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
      chord: {},
      settings: {
        isShow: null,
        language: null,
        key: 0,
        offset: 0,
        isTranspose: false,
        transposeKey: 0,
        transposeOffset: 0,
        vol: 0.84,
        delay: 600,
        duration: 1.5,
        arpeggio: 0.04,
        clef: "treble",
        note: "quarter",
        inst: "piano",
        isDelay: false,
        isArpeggio: false,
        isColorNote: false,
        isColorNoteName: true,
        isShowRoman: false,
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false
      },
      position: {},
      range: null,
      textNode: null,
      highlightPos: {},
      highlightRect: null,
      pageX: 0,
      pageY: 0,
      clientX: 0,
      clientY: 0,
      timeoutId: null,
      showChord: false
    };
  },
  watch: {
    chord: function(val) {
      if (!val.string) return;
      this.range.setStart(this.textNode, val.position);
      this.range.setEnd(this.textNode, val.position + val.string.length);
      var rangeRect = this.range.getBoundingClientRect();
      var offsetRect = offsetBase.getBoundingClientRect();
      this.highlightRect = {
        top: rangeRect.top - offsetRect.top,
        left: rangeRect.left - offsetRect.left,
        width: rangeRect.width,
        height: rangeRect.height,
      };
      this.highlightRect.bottom = this.highlightRect.top + this.highlightRect.height;
      this.highlightRect.right = this.highlightRect.left + this.highlightRect.width;
      if (this.cursorInRect()) {
        this.highlightPos = {
          top: this.highlightRect.top + "px",
          left: this.highlightRect.left + "px",
          width: this.highlightRect.width + "px",
          height: this.highlightRect.height + "px"
        };
        this.timeoutId = setTimeout(this.displayChord, this.settings.isDelay * this.settings.delay);
      } else {
        this.chord = {};
        this.highlightRect = null;
      }
    }
  },
  mounted() {
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
            if (/^en-(gb|ie|au|nz)/i.test(languages[i])) return "gb";
            if (/^en/i.test(languages[i])) return "en";
          }
          return "en";
        })([].concat(window.navigator.language, window.navigator.userLanguage, window.navigator.browserLanguage, window.navigator.systemLanguage, window.navigator.languages));
        if (this.settings.isShow === null) this.settings.isShow = true;
      }.bind(this)
    );
    window.addEventListener("mousemove", function(e) {
      this.pageX = Math.min(e.pageX, document.documentElement.scrollWidth);
      this.pageY = Math.min(e.pageY, document.documentElement.scrollHeight);
      this.clientX = e.clientX;
      this.clientY = e.clientY;
      if (this.highlightRect && this.cursorInRect()) this.updated();
      else {
        if (this.timeoutId !== null) clearTimeout(this.timeoutId);
        this.showChord = false;
        this.chord = {};
        this.highlightRect = null;
        this.setPointedChord();
      }
    }.bind(this));
  },
  methods: {
    setPointedChord: function() {
      if (document.caretPositionFromPoint) {
        this.range = document.caretPositionFromPoint(this.clientX, this.clientY);
        if (!this.range) return;
        this.textNode = this.range.offsetNode;
      } else if (document.caretRangeFromPoint) {
        this.range = document.caretRangeFromPoint(this.clientX, this.clientY);
        if (!this.range) return;
        this.textNode = this.range.startContainer;
      } else return;
      if (!this.textNode || this.textNode.nodeType !== 3 || this.$el.contains(this.textNode)) return;
      if (!this.textNode.parentNode.matches(":hover")) return;
      ChordNote.parseContent.transposeOn = this.settings.isTranspose;
      ChordNote.parseContent.intervalNote = ChordNote.Note(this.settings.key, this.settings.offset);
      ChordNote.parseContent.transposeTo = ChordNote.Note(this.settings.transposeKey, this.settings.transposeOffset);
      this.chord = ChordNote.parseContent(this.textNode.nodeValue, this.range.startOffset);
    },
    updated: function() {
      if (!this.showChord || !this.chord.string) return;
      var div = document.getElementById("chord-dictionary-pop-up");
      if (!div) return;
      var dimension = div.getBoundingClientRect();
      this.position = {
        top: (dimension.height + this.pageY - window.scrollY + 30 > document.documentElement.clientHeight ? this.pageY - dimension.height - 10 : this.pageY + 20) + "px",
        left: (dimension.width + this.pageX - window.scrollX + 30 > document.documentElement.clientWidth ? this.pageX - dimension.width - 10 : this.pageX + 20) + "px"
      };
    },
    cursorInRect: function() {
      return this.pageY >= this.highlightRect.top && this.pageY <= this.highlightRect.bottom && this.pageX >= this.highlightRect.left && this.pageX <= this.highlightRect.right;
    },
    displayChord: function() {
      this.showChord = true;
      this.updated();
      this.timeoutId = null;
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
#chord-dictionary-wrapper .chord-dictionary-white {
  font-style: bold;
}
#chord-dictionary-wrapper .chord-dictionary-acci {
  font-family: "FreeSerif";
  font-size: 115%;
  position: relative;
  bottom: 3px;
}
#chord-dictionary-wrapper .chord-dictionary-part {
  margin-right: 10px;
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-0 {
  color: hsl(0, 88%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-1 {
  color: hsl(30, 99%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-2 {
  color: hsl(49, 90%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-3 {
  color: hsl(60, 98%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-4 {
  color: hsl(79, 59%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-5 {
  color: hsl(135, 76%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-6 {
  color: hsl(172, 68%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-7 {
  color: hsl(191, 41%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-8 {
  color: hsl(273, 79%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-9 {
  color: hsl(291, 46%, 33%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-10 {
  color: hsl(295, 97%, 46%);
}
#chord-dictionary-wrapper .chord-dictionary-color-name .chord-dictionary-midi-11 {
  color: hsl(332, 97%, 33%);
}
</style>
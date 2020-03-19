<template>
  <div v-show="isActive">
    <div
      id="highlight"
      :style="{ top: highlightPos.top + 'px' , left: highlightPos.left + 'px' , bottom: highlightPos.bottom + 'px' , right: highlightPos.right + 'px' }"
    ></div>
    <b-card-group
      deck
      id="pop-up"
      v-show="chord"
      :style="{ top: position.top + 'px' , left: position.left + 'px' }"
    >
      <b-card no-body>
        <b-card-header>
          <b-card-title class="mb-0" title-tag="h6">{{chord.titleElement}}</b-card-title>
          <b-card-sub-title
            class="mt-2 mb-0"
            v-if="chord.isInterval || settings.isShowRoman"
          >{{chord.subtitleElement}}</b-card-sub-title>
        </b-card-header>
        <b-card-body>
          <b-card-text class="mb-0">{{chord.originalElement}}</b-card-text>
          <score :chordDisplay="chord" class="mt-0" />
        </b-card-body>
      </b-card>
    </b-card-group>
    <player :isActive="isActive" :chordVoicing="chord.voicing" :settings="settings" />
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
import { Note, Chord, transpose, parseContent } from "../assets/ChordNote.js";
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
      chord: null,
      position: {
        top: 0,
        left: 0
      },
      highlightPos: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
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
      }
    };
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
    setPointedChord(e) {
      let range;
      let textNode;
      if (document.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (!range) return;
        textNode = range.offsetNode;
      } else if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!range) return;
        textNode = range.startContainer;
      } else return;
      if (!textNode || textNode.nodeType !== 3) return;

      Note.useUnicode = true;
      Note.useDouble = true;
      Note.romanUseUnicode = true;
      Note.romanUseLowerCase = false;

      ChordNote.parseContent.intervalNote = ChordNote.Note(this.settings.key, this.settings.offset);
      ChordNote.parseContent.transposeTo = ChordNote.Note(this.settings.transposeKey, this.settings.transposeOffset);
      this.chord = ChordNote.parseContent(textNode.nodeValue, range.startOffset);
      
      range.setStart(textNode, this.chord.position);
      range.setEnd(textNode, this.chord.position + this.chord.string.length);
      this.highlightPos = range.getBoundingClientRect();

      /*
      // @https://javascript.g.hatena.ne.jp/edvakf/20110213/1297636186
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
      */
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
      (function(value) {
        if (!value) return false;
        this.settings = Object.assign(this.settings, value.settings);
      }).bind(this)
    );
    window.addEventListener(
      "mousemove",
      (function(e) {
        this.position.top = e.pageY + 16;
        this.position.left = e.pageX + 16;
        this.setPointedChord(e);
      }).bind(this)
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
  
  .note {font-style: bold;}
  .chord {color: #333; font-style: italic;}
  .slash {color: #888; font-size: 80%;}
  .bass {font-size: 80%;}
  .part {margin-right: 10px;}

  .midi-0 {color: hsl(0, 88%, 46%);}
  .midi-1 {color: hsl(30, 99%, 33%);}
  .midi-2 {color: hsl(49, 90%, 46%);}
  .midi-3 {color: hsl(60, 98%, 33%);}
  .midi-4 {color: hsl(79, 59%, 46%);}
  .midi-5 {color: hsl(135, 76%, 33%);}
  .midi-6 {color: hsl(172, 68%, 46%);}
  .midi-7 {color: hsl(191, 41%, 33%);}
  .midi-8 {color: hsl(273, 79%, 46%);}
  .midi-9 {color: hsl(291, 46%, 33%);}
  .midi-10 {color: hsl(295, 97%, 46%);}
  .midi-11 {color: hsl(332, 97%, 33%);}
}
#highlight {
	background-color: yellow;
}
</style>

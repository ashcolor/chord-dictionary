<script setup lang="ts">
import { onMounted, watch, ref, reactive, getCurrentInstance, computed } from "vue";
import ChordNote from "../../assets/ChordNote.js";
import Score from "./Score.vue";
import Player from "./Player.vue";
import Setting from "./Setting.vue";
import HighlightDiv from "./common/HighlightDiv.vue";

const instance = getCurrentInstance();

const isActive = ref(true);
const chord = ref({});
const settings = reactive({
    isShow: true,
    language: "en",
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
    isColorNoteName: false,
    isShowRoman: false,
    isActiveClick: true,
    isActiveKey: true,
    isActiveHover: false,
});
const range = ref(null);
const textNode = ref(null);
const highlightRect = reactive({
    isActive: false,
    top: null,
    left: null,
    width: null,
    height: null,
    bottom: null,
    right: null,
});
const pageX = ref(0);
const pageY = ref(0);
const clientX = ref(0);
const clientY = ref(0);
const showChord = ref(false);
const popUpRef = ref(null);

const popupPosition = computed(() => {
    if (!showChord.value || !chord.value.string) return;
    if (!popUpRef.value) return;
    const dimension = popUpRef.value.getBoundingClientRect();
    return {
        top:
            (dimension.height + pageY.value - window.scrollY + 30 >
            document.documentElement.clientHeight
                ? pageY.value - dimension.height - 10
                : pageY.value + 20) + "px",
        left:
            (dimension.width + pageX.value - window.scrollX + 30 >
            document.documentElement.clientWidth
                ? pageX.value - dimension.width - 10
                : pageX.value + 20) + "px",
    };
});

const transitionDelay = computed(() => {
    return settings.isDelay ? `${settings.delay / 1000}s` : "0s";
});

const offsetBase = document.createElement("div");
offsetBase.style.position = "absolute";
offsetBase.style.top = 0;
offsetBase.style.left = 0;
document.body.appendChild(offsetBase);

watch(chord, (val) => {
    if (!val.string) return;
    range.value.setStart(textNode.value, val.position);
    range.value.setEnd(textNode.value, val.position + val.string.length);
    const rangeRect = range.value.getBoundingClientRect();
    const offsetRect = offsetBase.getBoundingClientRect();
    highlightRect.isActive = true;
    highlightRect.top = rangeRect.top - offsetRect.top;
    highlightRect.left = rangeRect.left - offsetRect.left;
    highlightRect.width = rangeRect.width;
    highlightRect.height = rangeRect.height;
    highlightRect.bottom = highlightRect.top + highlightRect.height;
    highlightRect.right = highlightRect.left + highlightRect.width;
    if (cursorInRect()) {
        displayChord();
    } else {
        chord.value = {};
        highlightRect.isActive = false;
    }
});

onMounted(() => {
    if (chrome?.runtime) {
        chrome.runtime.onMessage.addListener((object) => {
            isActive.value = object.isActive;
        });
    }
    if (chrome?.storage) {
        chrome.storage.local.get("settings", (value) => {
            if (value) Object.assign(settings, value.settings);
            settings.language =
                settings.language ||
                ((languages) => {
                    for (let i = 0; i < languages.length; i++) {
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
                })(
                    [].concat(
                        window.navigator.language,
                        window.navigator.userLanguage,
                        window.navigator.browserLanguage,
                        window.navigator.systemLanguage,
                        window.navigator.languages
                    )
                );
            if (settings.isShow === null) settings.isShow = true;
        });
    }

    window.addEventListener("mousemove", (e) => {
        pageX.value = Math.min(e.pageX, document.documentElement.scrollWidth);
        pageY.value = Math.min(e.pageY, document.documentElement.scrollHeight);
        clientX.value = e.clientX;
        clientY.value = e.clientY;
        if (highlightRect.isActive && cursorInRect()) {
        } else {
            showChord.value = false;
            chord.value = {};
            highlightRect.isActive = false;
            setPointedChord();
        }
    });
});

const setPointedChord = () => {
    if (document.caretPositionFromPoint) {
        range.value = document.caretPositionFromPoint(clientX.value, clientY.value);
        if (!range.value) return;
        textNode.value = range.value.offsetNode;
    } else if (document.caretRangeFromPoint) {
        range.value = document.caretRangeFromPoint(clientX.value, clientY.value);
        if (!range.value) return;
        textNode.value = range.value.startContainer;
    } else return;
    if (
        !textNode.value ||
        textNode.value.nodeType !== 3 ||
        instance.proxy.$el.contains(textNode.value)
    )
        return;
    if (!textNode.value.parentNode.matches(":hover")) return;
    ChordNote.parseContent.transposeOn = settings.isTranspose;
    ChordNote.parseContent.intervalNote = ChordNote.Note(settings.key, settings.offset);
    ChordNote.parseContent.transposeTo = ChordNote.Note(
        settings.transposeKey,
        settings.transposeOffset
    );
    chord.value = ChordNote.parseContent(textNode.value.nodeValue, range.value.startOffset);
};

const cursorInRect = () => {
    return (
        pageY.value >= highlightRect.top &&
        pageY.value <= highlightRect.bottom &&
        pageX.value >= highlightRect.left &&
        pageX.value <= highlightRect.right
    );
};
const displayChord = () => {
    showChord.value = true;
};
</script>

<template>
    <div v-show="isActive">
        <transition name="pop-up">
            <div
                v-if="showChord && chord.string"
                id="chord-dictionary-pop-up"
                :style="popupPosition"
                ref="popUpRef"
                deck
            >
                <v-card
                    :class="{ 'chord-dictionary-color-name': settings.isColorNoteName }"
                    no-body
                >
                    <template #title>
                        <div v-html="chord.titleElement && chord.titleElement.innerHTML"></div>
                    </template>
                    <template #subtitle v-show="chord.isInterval || settings.isShowRoman">
                        <div
                            v-html="chord.subtitleElement && chord.subtitleElement.innerHTML"
                        ></div>
                    </template>
                    <template #text>
                        <div
                            v-html="chord.originalElement && chord.originalElement.innerHTML"
                        ></div>
                        <Score
                            :chord="chord"
                            :settings="settings"
                            @updated="updated"
                            class="mt-0"
                        />
                    </template>
                </v-card>
            </div>
        </transition>
        <player :isActive="isActive" :showChord="showChord" :chord="chord" :settings="settings" />
        <HighlightDiv v-if="chord.string" :highlightRect="highlightRect" />
        <setting :settings="settings" />
    </div>
</template>

<style scoped>
#chord-dictionary-wrapper #chord-dictionary-pop-up {
    text-align: left;
    position: absolute !important;
    z-index: 2147483647;
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
.pop-up-enter-active {
    transition: opacity 0.2s ease;
    transition-delay: v-bind(transitionDelay);
}
.pop-up-leave-active {
    transition: opacity 0.2s ease;
}
.pop-up-enter,
.pop-up-leave-to {
    opacity: 0;
}
</style>

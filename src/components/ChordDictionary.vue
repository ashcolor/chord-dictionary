<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, computed } from "vue";
import { useMouse, useElementBounding } from "@vueuse/core";
import { useMouseInRange } from "../composables/useMouseInRange";
import { useCuretRange } from "../composables/useCuretRange";
import { useSettingsStore } from "../store/useSettings";
import ChordNote from "../../assets/ChordNote.js";
import ChordCard from "./ChordCard.vue";
import ChordPlayer from "./ChordPlayer.vue";
import ChordSetting from "./ChordSetting.vue";
import HighlightOverlay from "./common/HighlightOverlay.vue";
import TransitionController from "./common/TransitionController.vue";

const settingStore = useSettingsStore();
const { settings } = settingStore;

const { x: pageX, y: pageY } = useMouse({ type: "page" });

const isAppActive = ref(true);

const popUpRef = ref(null);
const { width: popupWidth, height: popupHeight } = useElementBounding(popUpRef);

const instance = getCurrentInstance();

const popupPosition = computed(() => {
    if (!chord.value.string) return;
    if (!popUpRef.value) return;

    const MARGIN_Y = 30;
    const MARGIN_X = 30;

    const isPopupYWithinViewPortWithMargin =
        pageY.value + popupHeight.value + MARGIN_Y <
        window.scrollY + document.documentElement.clientHeight;

    const CURSOR_TO_POPUP_DISTANCE_Y = 15;

    const top =
        (isPopupYWithinViewPortWithMargin
            ? pageY.value + CURSOR_TO_POPUP_DISTANCE_Y
            : pageY.value - popupHeight.value - CURSOR_TO_POPUP_DISTANCE_Y) + "px";

    const isPopupXWithinViewPortWithMargin =
        pageX.value + popupWidth.value + MARGIN_X <
        window.scrollX + document.documentElement.clientWidth;

    const CURSOR_TO_POPUP_DISTANCE_X = 15;

    const left =
        (isPopupXWithinViewPortWithMargin
            ? pageX.value + CURSOR_TO_POPUP_DISTANCE_X
            : pageX.value - popupWidth.value - CURSOR_TO_POPUP_DISTANCE_X) + "px";

    return { top, left };
});

const { caretRange, caretRangeTextNode } = useCuretRange();
const { caretRange: curetRangeCopy } = useCuretRange();

const chord = computed(() => {
    if (!caretRangeTextNode.value) return {};

    if (
        !caretRangeTextNode.value ||
        caretRangeTextNode.value.nodeType !== 3 ||
        instance?.parent?.vnode.el?.contains(caretRangeTextNode.value)
    )
        return {};

    if (!caretRangeTextNode.value.parentNode.matches(":hover")) return {};

    ChordNote.parseContent.transposeOn = settings.isTranspose;
    ChordNote.parseContent.intervalNote = ChordNote.Note(settings.key, settings.offset);
    ChordNote.parseContent.transposeTo = ChordNote.Note(
        settings.transposeKey,
        settings.transposeOffset
    );
    return ChordNote.parseContent(caretRangeTextNode.value.nodeValue, caretRange.value.startOffset);
});

const highlightChordRange = computed(() => {
    if (!chord.value.string) return null;
    if (!curetRangeCopy.value) return null;

    curetRangeCopy.value.setStart(caretRangeTextNode.value, chord.value.position);
    curetRangeCopy.value.setEnd(
        caretRangeTextNode.value,
        chord.value.position + chord.value.string.length
    );

    return curetRangeCopy.value;
});

const {
    rangePositionX: highlightRangePositionX,
    rangePositionY: highlightRangePositionY,
    rangeWidth: highlightRangeWidth,
    rangeHeight: highlightRangeHeight,
    isOutside: isHighlightRangeOutside,
} = useMouseInRange(highlightChordRange);

onMounted(() => {
    if (chrome?.runtime) {
        chrome.runtime.onMessage.addListener((object) => {
            isAppActive.value = object.isActive;
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
});
</script>

<template>
    <div v-show="isAppActive">
        <TransitionController :is-active="settings.isDelay" :delay="settings.delay / 1000">
            <div
                v-if="chord.string && !isHighlightRangeOutside"
                id="chord-dictionary-pop-up"
                ref="popUpRef"
                :style="popupPosition"
            >
                <ChordCard :chord="chord"></ChordCard>
            </div>
        </TransitionController>
        <ChordPlayer :is-active="isAppActive" :chord="chord"></ChordPlayer>
        <HighlightOverlay
            v-if="chord.string && !isHighlightRangeOutside"
            :top="highlightRangePositionY"
            :left="highlightRangePositionX"
            :width="highlightRangeWidth"
            :height="highlightRangeHeight"
        ></HighlightOverlay>
        <ChordSetting></ChordSetting>
    </div>
</template>

<style scoped>
#chord-dictionary-pop-up {
    text-align: left;
    position: absolute !important;
    z-index: 2147483647;
}
</style>

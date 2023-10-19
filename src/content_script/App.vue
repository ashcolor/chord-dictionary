<script setup lang="ts">
import { watch, onMounted, ref, getCurrentInstance, computed } from "vue";
import { useMouse, useElementBounding } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useMouseInRange } from "../composables/useMouseInRange";
import { useCuretRange } from "../composables/useCuretRange";
import { useSettingsStore } from "../store/useSettings";
import ChordNote from "../../assets/ChordNote.js";
import ChordCard from "../components/ChordCard.vue";
import ChordPlayer from "../components/ChordPlayer.vue";
import HighlightOverlay from "../components/feature/chord-card/HighlightOverlay.vue";
import TransitionController from "../components/feature/chord-card/TransitionController.vue";

const settingStore = useSettingsStore();
const { settings } = settingStore;

const { x: pageX, y: pageY } = useMouse({ type: "page" });

const isAppActive = ref(true);

const popUpRef = ref<HTMLElement | null>(null);
const { width: popupWidth, height: popupHeight } = useElementBounding(popUpRef);

const instance = getCurrentInstance();

const { t, locale } = useI18n({ useScope: "global" });

watch(
    settings,
    (newSettings) => {
        locale.value = newSettings.language;
        if (instance?.parent?.vnode?.el?.lang) {
            instance.parent.vnode.el.lang = t("code");
        }
    },
    { deep: true }
);

onMounted(() => {
    locale.value = settings.language;

    if (instance?.parent?.vnode?.el?.lang) {
        instance.parent.vnode.el.lang = t("code");
    }
});

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

const highlightBaseElement = ref<HTMLElement | null>(null);
const highlightBaseOffsetRect = computed(() => {
    return highlightBaseElement.value?.getBoundingClientRect();
});

const {
    rangePositionX: highlightRangePositionX,
    rangePositionY: highlightRangePositionY,
    rangeWidth: highlightRangeWidth,
    rangeHeight: highlightRangeHeight,
    isOutside: isHighlightRangeOutside,
} = useMouseInRange(highlightChordRange);

const isChordActive = computed(() => {
    return isAppActive.value && chord.value.string && !isHighlightRangeOutside.value;
});
</script>

<template>
    <div v-show="isAppActive">
        <TransitionController :is-active="settings.isDelay" :delay="settings.delay / 1000">
            <div v-if="isChordActive" id="pop-up" ref="popUpRef" :style="popupPosition">
                <ChordCard
                    :chord="chord"
                    :chord-name="chord.name"
                    :chord-original="chord.original"
                    :chord-title-element="chord.titleElement"
                    :chord-subtitle-element="chord.subtitleElement"
                    :chord-original-element="chord.originalElement"
                    :chord-is-interval="chord.chordIsInterval"
                ></ChordCard>
            </div>
        </TransitionController>
        <ChordPlayer
            :is-active="isAppActive"
            :chord="chord"
            :chord-name="chord.name"
            :chord-voicing="chord.voicing"
        ></ChordPlayer>
        <Teleport to="body">
            <div ref="highlightBaseElement" style="position: absolute; left: 0; top: 0"></div>
        </Teleport>
        <HighlightOverlay
            v-if="isChordActive"
            :top="highlightRangePositionY - (highlightBaseOffsetRect?.top || 0)"
            :left="highlightRangePositionX - (highlightBaseOffsetRect?.left || 0)"
            :width="highlightRangeWidth"
            :height="highlightRangeHeight"
        ></HighlightOverlay>
    </div>
</template>

<style scoped>
#pop-up {
    text-align: left;
    position: absolute !important;
    z-index: 2147483647;
}
</style>

<style>
body {
    position: relative;
}
</style>

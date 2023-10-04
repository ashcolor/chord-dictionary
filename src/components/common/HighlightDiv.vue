<script setup>
import { computed } from "vue";
const props = defineProps({
    highlightRect: Object,
});

const highlightPosition = computed(() => {
    return {
        top: props.highlightRect.top + "px",
        left: props.highlightRect.left + "px",
        width: props.highlightRect.width + "px",
        height: props.highlightRect.height + "px",
    };
});
</script>

<template>
    <div id="chord-dictionary-highlight" :style="highlightPosition" />
</template>

<style scoped>
#chord-dictionary-wrapper #chord-dictionary-highlight {
    position: absolute;
    background-color: yellow;
    z-index: -2147483648;
}
</style>

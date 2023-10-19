<script setup lang="ts">
import { computed } from "vue";

interface Props {
    top: number;
    left: number;
    width: number;
    height: number;
}

const props = withDefaults(defineProps<Props>(), {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
});

const style = computed(() => {
    return {
        top: `${props.top}px`,
        left: `${props.left}px`,
        width: `${props.width}px`,
        height: `${props.height}px`,
    };
});
</script>

<template>
    <div id="chord-dictionary-highlight" :style="style"></div>
</template>

<style scoped>
#chord-dictionary-highlight {
    position: absolute;
    background-color: yellow;
    z-index: -2147483648;
}
</style>

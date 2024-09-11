<script setup lang="ts">
import { ref, computed } from "vue";

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

const highlightBaseElement = ref<HTMLElement | null>(null);
const highlightBaseOffsetRect = computed(() => {
    return highlightBaseElement.value?.getBoundingClientRect();
});

const style = computed(() => {
    return {
        top: `${props.top - (highlightBaseOffsetRect.value?.top || 0)}px`,
        left: `${props.left - (highlightBaseOffsetRect.value?.left || 0)}px`,
        width: `${props.width}px`,
        height: `${props.height}px`,
    };
});
</script>

<template>
    <Teleport to="body">
        <div ref="highlightBaseElement" style="position: absolute; left: 0; top: 0"></div>
    </Teleport>
    <div class="absolute bg-yellow-200" :style="style" style="z-index: -2147483648"></div>
</template>

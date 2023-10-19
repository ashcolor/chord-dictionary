<script setup lang="ts">
import { computed } from "vue";

interface Props {
    isActive?: boolean;
    delay?: number;
}

const props = withDefaults(defineProps<Props>(), {
    isActive: true,
    delay: 0,
});

const transitionDelay = computed(() => {
    return props.isActive ? `${props.delay}s` : "0s";
});
</script>

<template>
    <Transition>
        <slot></slot>
    </Transition>
</template>

<style>
.v-enter-active {
    transition: opacity 0.2s ease;
    transition-delay: v-bind(transitionDelay);
}
.v-leave-active {
    transition: opacity 0.2s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>

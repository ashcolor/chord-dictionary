<script setup lang="ts">
const modelValue = defineModel();

interface Props {
    min: number;
    max: number;
    step?: number
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 100,
    step: 1
});
</script>

<template>
    <input
        v-model="modelValue"
        type="range"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        class="daisy-range"
    />
</template>

<script setup lang="ts">
const modelValue = defineModel();

interface Props {
    options: Array<Option>;
}

interface Option {
    value: string;
    label: string;
}

const props = withDefaults(defineProps<Props>(), {
    options: () => [],
});
</script>

<template>
    <select v-model="modelValue" :options="options">
        <option v-for="option in props.options" :key="option.value" :value="option.value">
            {{ option.label }}
        </option>
    </select>
</template>

<style scoped>
select {
    padding-inline-start: 10px;
    display: inline-flex;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    height: 3rem;
    padding-left: 1rem;
    padding-right: 2.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 2;
    min-height: 3rem;
    border-width: 1px;
    border-color: hsl(215 28% 17%) / 0.2;
    border-radius: 0.5rem;
    border-style: solid;
    background-image: linear-gradient(45deg, transparent 50%, currentColor 50%),
        linear-gradient(135deg, currentColor 50%, transparent 50%);
    background-position: calc(100% - 20px) calc(1px + 50%), calc(100% - 16.1px) calc(1px + 50%);
    background-size: 4px 4px, 4px 4px;
    background-repeat: no-repeat;
}
</style>

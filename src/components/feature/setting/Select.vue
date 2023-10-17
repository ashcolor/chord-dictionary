<script setup lang="ts">
const modelValue = defineModel();

interface Option {
    value: string | number;
    label: string;
}

interface Props {
    options: Array<Option>;
}

const props = withDefaults(defineProps<Props>(), {
    options: () => [],
});
</script>

<template>
    <select v-model="modelValue" class="daisy-select daisy-select-bordered w-fit border">
        <option v-for="option in props.options" :key="option.value" :value="option.value">
            {{ option.label }}
        </option>
    </select>
</template>

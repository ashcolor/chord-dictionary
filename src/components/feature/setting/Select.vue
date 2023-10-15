<script setup lang="ts">
const modelValue = defineModel();

interface Props {
    options: Array<Option>;
}

interface Option {
    value: string | number;
    label: string;
}

const props = withDefaults(defineProps<Props>(), {
    options: () => [],
});
</script>

<template>
    <select
        v-model="modelValue"
        :options="options"
        class="daisy-select daisy-select-bordered w-fit border"
    >
        <option v-for="option in props.options" :key="option.value" :value="option.value">
            {{ option.label }}
        </option>
    </select>
</template>

<script setup>
const props = defineProps({
    value: Number,
    min: Number,
    max: Number,
});

const emit = defineEmits(["input"]);

const onChange = () => {
    emit("input", props.value);
};
</script>

<template>
    <b-form-input
        v-model="value"
        type="range"
        :min="min"
        :max="max"
        step="any"
        @change="onChange()"
    ></b-form-input>
</template>

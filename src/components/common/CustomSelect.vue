<script setup>
const props = defineProps({
    options: Array,
    value: String,
});

const emit = defineEmits(["input"]);

const onChange = () => {
    emit("input", props.value);
};
</script>

<template>
    <b-form-select v-model="value" :options="options" @change="onChange"></b-form-select>
</template>

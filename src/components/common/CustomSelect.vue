<script setup lang="ts">
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
    <v-select :value="value" :options="options" @change="onChange"></v-select>
</template>

<script setup>
const props = defineProps({
    label: String,
    value: String | Boolean,
});

const emit = defineEmits(["input"]);

const onChange = () => {
    emit("input", props.value);
};
</script>

<template>
    <b-form-checkbox v-model="value" onclick="blur()" switch @change="onChange()">
        {{ label }}
    </b-form-checkbox>
</template>

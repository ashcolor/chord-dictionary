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
    <v-toggle :value="value" onclick="blur()" switch @change="onChange()">
        {{ label }}
    </v-toggle>
</template>

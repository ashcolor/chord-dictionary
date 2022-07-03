<script setup>
const props = defineProps({
    label: String,
    options: Array,
    value: String,
});

const emit = defineEmits(["input"]);

const onChange = () => {
    emit("input", props.value);
};
</script>

<template>
    <b-input-group class="mb-2">
        <template v-slot:prepend>
            <b-input-group-text>{{ label }}</b-input-group-text>
        </template>
        <b-form-select v-model="value" :options="options" @change="onChange"></b-form-select>
    </b-input-group>
</template>

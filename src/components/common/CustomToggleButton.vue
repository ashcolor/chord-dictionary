<script setup>
import { Icon } from "@iconify/vue2";

const props = defineProps({
    icon: String,
    value: String | Boolean,
});

const emit = defineEmits(["input"]);

const onClick = () => {
    emit("input", !props.value);
};
</script>

<template>
    <b-button onclick="blur()" @click="onClick()" size="sm" class="mb-2">
        <Icon :icon="icon" />
    </b-button>
</template>

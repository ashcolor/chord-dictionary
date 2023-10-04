<script setup lang="ts">
import { Icon } from "@iconify/vue";

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
    <v-button onclick="blur()" @click="onClick()" size="sm" class="mb-2">
        <Icon :icon="icon" />
    </v-button>
</template>

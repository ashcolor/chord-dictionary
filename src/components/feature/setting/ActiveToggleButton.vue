<script setup lang="ts">
import { Icon } from "@iconify/vue";

const modelValue = defineModel();
</script>

<template>
    <button
        class="daisy-btn daisy-btn-circle"
        :class="{ 'daisy-btn-active': modelValue }"
        @click="modelValue = !modelValue"
    >
        <Icon icon="mdi:cog"></Icon>
    </button>
</template>

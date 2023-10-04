<script setup lang="ts">
const props = defineProps({
    label: String,
});
</script>

<template>
    <div class="mb-2">
        <p>{{ label }}</p>
        <slot> </slot>
    </div>
</template>

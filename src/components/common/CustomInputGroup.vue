<script setup>
const props = defineProps({
    label: String,
});
</script>

<template>
    <b-input-group class="mb-2">
        <template v-slot:prepend>
            <b-input-group-text>{{ label }}</b-input-group-text>
        </template>
        <slot> </slot>
    </b-input-group>
</template>

<script setup lang="ts">
interface Props {
    label: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: String,
});
</script>

<template>
    <div class="mb-2">
        <p>{{ props.label }}</p>
        <slot> </slot>
    </div>
</template>

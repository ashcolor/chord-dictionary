<script setup lang="ts">
interface Props {
    label: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: "",
});
</script>

<template>
    <div class="daisy-form-control w-full max-w-xs">
        <label class="daisy-label">
            <span class="daisy-label-text">{{ props.label }}</span>
        </label>
        <slot> </slot>
    </div>
</template>

<script setup lang="ts">
const modelValue = defineModel();

interface Props {
    label: string;
}

const props = withDefaults(defineProps<Props>(), {
    label: "",
});
</script>

<template>
    <div class="daisy-form-control">
        <label class="daisy-label cursor-pointer gap-2">
            <span class="daisy-label-text whitespace-nowrap">{{ props.label }}</span>
            <input
                v-model="modelValue"
                type="checkbox"
                class="daisy-toggle daisy-toggle-primary border-solid"
            />
        </label>
    </div>
</template>

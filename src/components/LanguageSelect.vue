<script setup>
import { computed } from "vue";
import langs from "../config/i18n";

const props = defineProps({
  label: String,
  value: String,
});

const languages = computed(() => {
  return Object.keys(langs).map((v) => ({ value: v, text: langs[v].name }));
});

const emit = defineEmits(["input"]);

const onChange = () => {
  emit("input", props.value);
};
</script>

<template>
  <b-input-group class="mb-2">
    <template v-slot:prepend>
      <b-input-group-text>{{ $t("language") }}</b-input-group-text>
    </template>
    <b-form-select v-model="value" :options="languages" @change="onChange"></b-form-select>
  </b-input-group>
</template>

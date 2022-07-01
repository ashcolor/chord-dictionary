<script setup>
// import { computed } from "vue";
import { CLEFS } from "../config/const";

const props = defineProps({
  label: String,
  value: String,
});

const emit = defineEmits(["input"]);

const onChange = () => {
  emit("input", props.value);
};

// TODO $tが使えない
// const clefs = computed(() => {
//   return Object.keys(CLEFS).map((v) => ({ value: v, text: t(v) }));
// });
</script>

<template>
  <b-input-group class="mb-2">
    <template v-slot:prepend>
      <b-input-group-text>{{ $t("clef") }}</b-input-group-text>
    </template>
    <b-form-select
      v-model="value"
      :options="Object.keys(CLEFS).map((v) => ({ value: v, text: $t(v) }))"
      @change="onChange"
    ></b-form-select>
  </b-input-group>
</template>

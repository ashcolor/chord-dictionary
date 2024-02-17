<script setup lang="ts">
import { useSettingsStore } from "../../../store/useSettings";

const settingStore = useSettingsStore();
const { settings } = settingStore;
</script>

<template>
    <div class="daisy-form-control">
        <label
            :class="{ 'daisy-btn-primary': settings.isActive }"
            class="daisy-btn daisy-btn-circle daisy-swap daisy-btn-sm"
        >
            <input v-model="settings.isActive" type="checkbox" />
            <div class="daisy-swap-on">ON</div>
            <div class="daisy-swap-off">OFF</div>
        </label>
    </div>
</template>

<script setup lang="ts">
import { watch, getCurrentInstance } from "vue";
import ChordSettingHeader from "../components/feature/setting/Header.vue";
import ChordSetting from "../components/ChordSetting.vue";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "../store/useSettings";

const { t, locale } = useI18n({ useScope: "global" });

const settingStore = useSettingsStore();
const { settings } = settingStore;

const instance = getCurrentInstance();

watch(
    () => settings.language,
    (newLanguage) => {
        if (chrome?.storage) {
            locale.value = newLanguage;
        }

        if (instance?.parent?.vnode?.el?.lang) {
            instance.parent.vnode.el.lang = t("code");
        }
    }
);
</script>

<template>
    <div id="chord-dictionary-app">
        <ChordSettingHeader></ChordSettingHeader>
        <ChordSetting></ChordSetting>
    </div>
</template>

<style>
body {
    min-width: fit-content;
}
</style>

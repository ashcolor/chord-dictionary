<script setup lang="ts">
import { onMounted, watch, computed, getCurrentInstance, ref } from "vue";
import { CLEFS, NOTES, OFFSETS, INSTS, KEYS } from "../config/const";
import { util } from "../utils/util";
import CustomSelect from "./common/CustomSelect.vue";
import CustomInputGroup from "./common/CustomInputGroup.vue";
import { useI18n } from "vue-i18n";
import { Icon } from "@iconify/vue";

const { t, availableLocales, locale, messages } = useI18n({ useScope: "global" });

console.log(locale.value);
console.log(availableLocales);

locale.value = "en";

// const instance = getCurrentInstance();

const props = defineProps({
    settings: Object,
});

watch(
    props.settings,
    (newSettings) => {
        // TODO
        if (chrome?.storage) {
            chrome.storage.local.set({ settings: newSettings });
        }

        locale.value = newSettings.language;
        // TODO
        // instance.proxy.$parent.$el.lang = instance.proxy.t("code");
    },
    { deep: true }
);

onMounted(() => {
    locale.value = props.settings.language;
    //TODO
    // instance.proxy.$parent.$el.lang = instance.proxy.t("code");
});
const overlay = ref(true);
</script>

<template>
    <div id="chord-dictionary-setting">
        <nav v-show="settings.isShow" id="chord-dictionary-sidebar">
            <v-card>
                <template #title>
                    {{ t("display_settings") }}
                </template>
                <template #text>
                    <CustomInputGroup :label="t('language')">
                        <CustomSelect
                            v-model="settings.language"
                            :options="
                                Object.keys(messages).map((key) => ({
                                    value: key,
                                    label: messages[key].name,
                                }))
                            "
                        ></CustomSelect>
                    </CustomInputGroup>
                    <hr />
                    <CustomInputGroup :label="t('clef')">
                        <CustomSelect
                            v-model="settings.clef"
                            :options="Object.keys(CLEFS).map((v) => ({ value: v, label: t(v) }))"
                        ></CustomSelect>
                    </CustomInputGroup>
                    <CustomInputGroup :label="t('note')">
                        <CustomSelect
                            v-model="settings.note"
                            :options="Object.keys(NOTES).map((v) => ({ value: v, label: t(v) }))"
                        ></CustomSelect
                    ></CustomInputGroup>
                    <hr />
                    <v-switch
                        v-model="settings.isShowRoman"
                        :label="t('roman_display')"
                        color="primary"
                    ></v-switch>
                    <CustomInputGroup :label="t('key')">
                        <CustomSelect v-model="settings.key" :options="KEYS"></CustomSelect>
                        <CustomSelect
                            v-model="settings.offset"
                            :options="OFFSETS"
                            style="font-family: 'FreeSerif'"
                        ></CustomSelect>
                    </CustomInputGroup>
                    <v-switch
                        v-model="settings.isTranspose"
                        :label="t('transpose')"
                        color="primary"
                    ></v-switch>
                    <CustomInputGroup v-show="settings.isTranspose" :label="t('transpose_to')">
                        <CustomSelect
                            v-model="settings.transposeKey"
                            :options="KEYS"
                        ></CustomSelect>
                        <CustomSelect
                            v-model="settings.transposeOffset"
                            :options="OFFSETS"
                            style="font-family: 'FreeSerif'"
                        ></CustomSelect>
                    </CustomInputGroup>
                    <p v-show="settings.isTranspose" class="small text-muted mb-0">
                        {{ t("transpose_hint") }}
                    </p>
                    <hr />
                    <v-switch
                        v-model="settings.isColorNote"
                        :label="t('color_note')"
                        color="primary"
                    ></v-switch>
                    <v-switch
                        v-model="settings.isColorNoteName"
                        :label="t('color_note_name')"
                        color="primary"
                    ></v-switch>
                    <v-switch
                        v-model="settings.isDelay"
                        :label="t('delay_show')"
                        color="primary"
                    ></v-switch>
                    <CustomInputGroup v-show="settings.isDelay" :label="t('delay')">
                        <v-slider v-model="settings.delay" :min="100" :max="1600"></v-slider>
                    </CustomInputGroup>
                </template>
            </v-card>
            <v-card>
                <template #title>
                    {{ t("player_settings") }}
                </template>
                <template #text>
                    <CustomInputGroup :label="t('volume')">
                        <v-slider v-model="settings.vol" :min="0" :max="1.2"></v-slider>
                    </CustomInputGroup>
                    <CustomInputGroup :label="t('duration')">
                        <v-slider v-model="settings.duration" :min="0.5" :max="3"></v-slider>
                    </CustomInputGroup>
                    <CustomInputGroup :label="t('instrument')">
                        <CustomSelect
                            v-model="settings.inst"
                            :options="INSTS.map((v) => ({ value: v.key, label: t(v.key) }))"
                        ></CustomSelect
                    ></CustomInputGroup>
                    <v-switch
                        v-model="settings.isArpeggio"
                        :label="t('arpeggio')"
                        color="primary"
                    ></v-switch>
                    <CustomInputGroup v-show="settings.isArpeggio" :label="t('gap')">
                        <v-slider v-model="settings.arpeggio" :min="0.01" :max="0.2"></v-slider>
                    </CustomInputGroup>
                    <hr />
                    <v-switch
                        v-model="settings.isActiveClick"
                        :label="t('click')"
                        color="primary"
                    ></v-switch>
                    <v-switch
                        v-model="settings.isActiveKey"
                        :label="t('shortcut')"
                        color="primary"
                    ></v-switch>
                    <span class="small text-muted mb-0">
                        ({{
                            util.isMac() ? "Cmd" : "Ctrl"
                        }}&thinsp;+&thinsp;Shift&thinsp;+&thinsp;Space)
                    </span>
                    <v-switch
                        v-model="settings.isActiveHover"
                        :label="t('hover')"
                        color="primary"
                    ></v-switch>
                </template>
            </v-card>
        </nav>
        <v-btn-toggle id="chord-dictionary-toggle-button" v-model="settings.isShow" color="primary">
            <v-btn icon="mdi-format-align-left">
                <Icon icon="mdi:cog"></Icon>
            </v-btn>
        </v-btn-toggle>
    </div>
</template>

<style>
#chord-dictionary-wrapper #chord-dictionary-setting {
    text-align: left;
    display: flex;
    align-items: stretch;
}
#chord-dictionary-wrapper #chord-dictionary-toggle-button {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 2147483646;
}
#chord-dictionary-wrapper #chord-dictionary-sidebar {
    position: fixed;
    bottom: 60px;
    right: 12px;
    z-index: 2147483645;
}
#chord-dictionary-wrapper select {
    -webkit-appearance: none;
    appearance: none;
}
#chord-dictionary-wrapper #chord-dictionary-setting nav {
    display: flex;
}
#chord-dictionary-wrapper #chord-dictionary-setting .card {
    width: 300px;
    flex: auto;
}
</style>
<style>
#chord-dictionary-wrapper .custom-range {
    width: 100%;
    height: 1.4rem;
    padding: 0;
    background-color: transparent;
    -webkit-appearance: none;
    appearance: none;
}
#chord-dictionary-wrapper .custom-range:focus {
    outline: none;
}
#chord-dictionary-wrapper .custom-range:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
#chord-dictionary-wrapper .custom-range::-webkit-slider-thumb {
    width: 1rem;
    height: 1rem;
    margin-top: -0.25rem;
    background-color: #007bff;
    border: 0;
    border-radius: 1rem;
    -webkit-transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
        box-shadow 0.15s ease-in-out;
    -webkit-appearance: none;
    appearance: none;
}
@media (prefers-reduced-motion: reduce) {
    #chord-dictionary-wrapper .custom-range::-webkit-slider-thumb {
        -webkit-transition: none;
        transition: none;
    }
}
#chord-dictionary-wrapper .custom-range::-webkit-slider-thumb:active {
    background-color: #b3d7ff;
}

body {
    position: relative;
}
</style>

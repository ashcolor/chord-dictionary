<script setup>
import { onMounted, watch, getCurrentInstance, computed } from "vue";
import CustomSelect from "./common/CustomSelect.vue";
import CustomToggle from "./common/CustomToggle.vue";
import CustomInputGroup from "./common/CustomInputGroup.vue";
import CustomRange from "./common/CustomRange.vue";
import langs from "../config/i18n";
import { CLEFS, NOTES, OFFSETS, INSTS, KEYS } from "../config/const";
import CustomToggleButton from "./common/CustomToggleButton.vue";

const instance = getCurrentInstance();

const props = defineProps({
    settings: Object,
});

const isMac = computed(() => (window.navigator.platform.includes("Mac") ? "Cmd" : "Ctrl"));

watch(
    props.settings,
    (newSettings) => {
        chrome.storage.local.set({ settings: newSettings });
        instance.proxy._i18n.locale = newSettings.language;
        instance.proxy.$parent.$el.lang = instance.proxy.$t("code");
    },
    { deep: true }
);

onMounted(() => {
    instance.proxy._i18n.locale = props.settings.language;
    instance.proxy.$parent.$el.lang = instance.proxy.$t("code");
});
</script>

<template>
    <div id="chord-dictionary-setting">
        <nav v-show="settings.isShow" id="chord-dictionary-sidebar">
            <b-card no-body>
                <b-card-header>{{ $t("display_settings") }}</b-card-header>
                <b-card-body>
                    <CustomInputGroup :label="$t('language')">
                        <CustomSelect
                            v-model="settings.language"
                            :options="
                                Object.keys(langs).map((v) => ({ value: v, text: langs[v].name }))
                            "
                        ></CustomSelect>
                    </CustomInputGroup>
                    <hr />
                    <CustomInputGroup :label="$t('clef')">
                        <CustomSelect
                            v-model="settings.clef"
                            :options="Object.keys(CLEFS).map((v) => ({ value: v, text: $t(v) }))"
                        ></CustomSelect>
                    </CustomInputGroup>
                    <CustomInputGroup :label="$t('note')">
                        <CustomSelect
                            v-model="settings.note"
                            :options="Object.keys(NOTES).map((v) => ({ value: v, text: $t(v) }))"
                        ></CustomSelect
                    ></CustomInputGroup>
                    <hr />
                    <CustomToggle
                        v-model="settings.isShowRoman"
                        :label="$t('roman_display')"
                    ></CustomToggle>
                    <CustomInputGroup :label="$t('key')">
                        <CustomSelect v-model="settings.key" :options="KEYS"></CustomSelect>
                        <CustomSelect
                            v-model="settings.offset"
                            :options="OFFSETS"
                            style="font-family: 'FreeSerif'"
                        ></CustomSelect>
                    </CustomInputGroup>
                    <CustomToggle
                        v-model="settings.isTranspose"
                        :label="$t('transpose')"
                    ></CustomToggle>
                    <CustomInputGroup v-show="settings.isTranspose" :label="$t('transpose_to')">
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
                        {{ $t("transpose_hint") }}
                    </p>
                    <hr />
                    <CustomToggle
                        v-model="settings.isColorNote"
                        :label="$t('color_note')"
                    ></CustomToggle>
                    <CustomToggle
                        v-model="settings.isColorNoteName"
                        :label="$t('color_note_name')"
                    ></CustomToggle>
                    <CustomToggle
                        v-model="settings.isDelay"
                        :label="$t('delay_show')"
                    ></CustomToggle>
                    <CustomInputGroup v-show="settings.isDelay" :label="$t('delay')">
                        <CustomRange v-model="settings.delay" :min="100" :max="1600"></CustomRange>
                    </CustomInputGroup>
                </b-card-body>
            </b-card>
            <b-card no-body>
                <b-card-header>{{ $t("player_settings") }}</b-card-header>
                <b-card-body>
                    <CustomInputGroup :label="$t('volume')">
                        <CustomRange v-model="settings.vol" :min="0" :max="1.2"></CustomRange>
                    </CustomInputGroup>
                    <CustomInputGroup :label="$t('duration')">
                        <CustomRange v-model="settings.duration" :min="0.5" :max="3"></CustomRange>
                    </CustomInputGroup>
                    <CustomInputGroup :label="$t('instrument')">
                        <CustomSelect
                            v-model="settings.inst"
                            :options="INSTS.map((v) => ({ value: v.key, text: $t(v.key) }))"
                        ></CustomSelect
                    ></CustomInputGroup>
                    <CustomToggle
                        v-model="settings.isArpeggio"
                        :label="$t('arpeggio')"
                    ></CustomToggle>
                    <CustomInputGroup v-show="settings.isArpeggio" :label="$t('gap')">
                        <CustomRange
                            v-model="settings.arpeggio"
                            :min="0.01"
                            :max="0.2"
                        ></CustomRange>
                    </CustomInputGroup>
                    <hr />
                    <CustomToggle
                        v-model="settings.isActiveClick"
                        :label="$t('click')"
                    ></CustomToggle>
                    <CustomToggle
                        v-model="settings.isActiveKey"
                        :label="$t('shortcut')"
                    ></CustomToggle>
                    <span class="small text-muted mb-0">
                        ({{ isMac ? "Cmd" : "Ctrl" }}
                        &thinsp;+&thinsp;Shift&thinsp;+&thinsp;Space)
                    </span>
                    <CustomToggle
                        v-model="settings.isActiveHover"
                        :label="$t('hover')"
                    ></CustomToggle>
                </b-card-body>
            </b-card>
        </nav>
        <CustomToggleButton
            v-model="settings.isShow"
            id="chord-dictionary-toggle-button"
            :icon="'ant-design:setting-filled'"
        />
    </div>
</template>

<style lang="scss">
#chord-dictionary-wrapper #chord-dictionary-setting {
    @import "node_modules/bootstrap/scss/bootstrap";
    @import "node_modules/bootstrap-vue/src/index.scss";
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
</style>

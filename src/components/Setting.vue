<script setup>
import langs from "../config/i18n";
import { CLEFS, NOTES, OFFSETS, INSTS, KEYS } from "../config/const";
import CustomSelect from "./common/CustomSelect.vue";
import { onMounted, watch, getCurrentInstance, computed } from "vue";

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
        <!-- Sidebar -->
        <nav v-show="settings.isShow" id="chord-dictionary-sidebar">
            <b-card no-body>
                <b-card-header>{{ $t("display_settings") }}</b-card-header>
                <b-card-body>
                    <CustomSelect
                        v-model="settings.language"
                        :label="$t('language')"
                        :options="
                            Object.keys(langs).map((v) => ({ value: v, text: langs[v].name }))
                        "
                    ></CustomSelect>
                    <hr />
                    <CustomSelect
                        v-model="settings.clef"
                        :label="$t('clef')"
                        :options="Object.keys(CLEFS).map((v) => ({ value: v, text: $t(v) }))"
                    ></CustomSelect>
                    <CustomSelect
                        v-model="settings.note"
                        :label="$t('note')"
                        :options="Object.keys(NOTES).map((v) => ({ value: v, text: $t(v) }))"
                    ></CustomSelect>
                    <hr />
                    <b-form-checkbox v-model="settings.isShowRoman" onclick="blur()" switch>{{
                        $t("roman_display")
                    }}</b-form-checkbox>
                    <b-input-group class="mb-2">
                        <template v-slot:prepend>
                            <b-input-group-text>{{ $t("key") }}</b-input-group-text>
                        </template>
                        <b-form-select v-model="settings.key" :options="KEYS"></b-form-select>
                        <b-form-select
                            v-model="settings.offset"
                            :options="OFFSETS"
                            style="font-family: 'FreeSerif'"
                        ></b-form-select>
                    </b-input-group>
                    <b-form-checkbox v-model="settings.isTranspose" onclick="blur()" switch>{{
                        $t("transpose")
                    }}</b-form-checkbox>
                    <b-input-group v-show="settings.isTranspose">
                        <template v-slot:prepend>
                            <b-input-group-text>{{ $t("transpose_to") }}</b-input-group-text>
                        </template>
                        <b-form-select
                            v-model="settings.transposeKey"
                            :options="KEYS"
                        ></b-form-select>
                        <b-form-select
                            v-model="settings.transposeOffset"
                            :options="OFFSETS"
                            style="font-family: 'FreeSerif'"
                        ></b-form-select>
                    </b-input-group>
                    <p v-show="settings.isTranspose" class="small text-muted mb-0">
                        {{ $t("transpose_hint") }}
                    </p>
                    <hr />
                    <b-form-checkbox v-model="settings.isColorNote" onclick="blur()" switch>{{
                        $t("color_note")
                    }}</b-form-checkbox>
                    <b-form-checkbox v-model="settings.isColorNoteName" onclick="blur()" switch>{{
                        $t("color_note_name")
                    }}</b-form-checkbox>
                    <b-form-checkbox v-model="settings.isDelay" onclick="blur()" switch>{{
                        $t("delay_show")
                    }}</b-form-checkbox>
                    <b-input-group class="mb-2" v-show="settings.isDelay">
                        <template v-slot:prepend>
                            <b-input-group-text>{{ $t("delay") }}</b-input-group-text>
                        </template>
                        <b-form-input
                            v-model="settings.delay"
                            type="range"
                            min="100"
                            max="1600"
                            step="any"
                        ></b-form-input>
                    </b-input-group>
                </b-card-body>
            </b-card>
            <b-card no-body>
                <b-card-header>{{ $t("player_settings") }}</b-card-header>
                <b-card-body>
                    <b-input-group class="mb-2">
                        <template v-slot:prepend>
                            <b-input-group-text>{{ $t("volume") }}</b-input-group-text>
                        </template>
                        <b-form-input
                            v-model="settings.vol"
                            type="range"
                            min="0"
                            max="1.2"
                            step="any"
                        ></b-form-input>
                    </b-input-group>
                    <b-input-group class="mb-2">
                        <template v-slot:prepend>
                            <b-input-group-text>{{ $t("duration") }}</b-input-group-text>
                        </template>
                        <b-form-input
                            v-model="settings.duration"
                            type="range"
                            min="0.5"
                            max="3"
                            step="any"
                        ></b-form-input>
                    </b-input-group>
                    <CustomSelect
                        v-model="settings.inst"
                        :label="$t('instrument')"
                        :options="INSTS.map((v) => ({ value: v.key, text: $t(v.key) }))"
                    ></CustomSelect>
                    <b-form-checkbox v-model="settings.isArpeggio" onclick="blur()" switch>{{
                        $t("arpeggio")
                    }}</b-form-checkbox>
                    <b-input-group class="mb-2" v-show="settings.isArpeggio">
                        <template v-slot:prepend>
                            <b-input-group-text>{{ $t("gap") }}</b-input-group-text>
                        </template>
                        <b-form-input
                            v-model="settings.arpeggio"
                            type="range"
                            min="0.01"
                            max="0.2"
                            step="any"
                        ></b-form-input>
                    </b-input-group>
                    <hr />
                    <b-form-checkbox v-model="settings.isActiveClick" onclick="blur()" switch>{{
                        $t("click")
                    }}</b-form-checkbox>
                    <b-form-checkbox v-model="settings.isActiveKey" onclick="blur()" switch>{{
                        $t("shortcut")
                    }}</b-form-checkbox>
                    <span class="small text-muted mb-0">
                        ({{ isMac ? "Cmd" : "Ctrl" }}
                        &thinsp;+&thinsp;Shift&thinsp;+&thinsp;Space)
                    </span>
                    <b-form-checkbox v-model="settings.isActiveHover" onclick="blur()" switch>{{
                        $t("hover")
                    }}</b-form-checkbox>
                </b-card-body>
            </b-card>
        </nav>
        <b-button
            :pressed.sync="settings.isShow"
            onclick="blur()"
            id="chord-dictionary-toggle-button"
            size="sm"
            class="mb-2"
        >
            <b-icon icon="gear-fill"></b-icon>
        </b-button>
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

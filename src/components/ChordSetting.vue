<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "../store/useSettings";
import { CLEFS, NOTES, OFFSETS, INSTRUMENTS, KEYS } from "../config/const";
import { Util } from "../utils/util";
import SettingSelect from "./feature/setting/Select.vue";
import SettingSlider from "./feature/setting/Slider.vue";
import SettingToggle from "./feature/setting/Toggle.vue";
import SettingInputGroup from "./feature/setting/InputGroup.vue";

const { t, messages } = useI18n({ useScope: "global" });

const settingStore = useSettingsStore();
const { settings } = settingStore;
</script>

<template>
    <div id="chord-dictionary-sidebar" class="flex flex-col">
        <div v-show="!settings.isActive" class="daisy-card daisy-card-compact">
            <div class="daisy-card-body"></div>
        </div>
        <div class="daisy-divider m-0 h-1"></div>
        <div v-show="settings.isActive" class="flex flex-row">
            <div class="daisy-card">
                <div class="daisy-card-body">
                    <div class="daisy-card-title whitespace-nowrap">
                        {{ t("display_settings") }}
                    </div>
                    <div>
                        <SettingInputGroup :label="t('language')">
                            <SettingSelect
                                v-model="settings.language"
                                :options="
                                    Object.keys(messages).map((key) => ({
                                        value: key,
                                        label: messages[key].name,
                                    }))
                                "
                            ></SettingSelect>
                        </SettingInputGroup>
                        <div class="daisy-divider" />
                        <SettingInputGroup :label="t('clef')">
                            <SettingSelect
                                v-model="settings.clef"
                                :options="
                                    Object.keys(CLEFS).map((v) => ({ value: v, label: t(v) }))
                                "
                            ></SettingSelect>
                        </SettingInputGroup>
                        <SettingInputGroup :label="t('note')">
                            <SettingSelect
                                v-model="settings.note"
                                :options="
                                    Object.keys(NOTES).map((v) => ({ value: v, label: t(v) }))
                                "
                            ></SettingSelect
                        ></SettingInputGroup>
                        <div class="daisy-divider" />
                        <SettingToggle
                            v-model="settings.isShowRoman"
                            :label="t('roman_display')"
                        ></SettingToggle>
                        <SettingInputGroup :label="t('key')">
                            <div class="flex flex-row">
                                <SettingSelect
                                    v-model="settings.key"
                                    :options="KEYS"
                                ></SettingSelect>
                                <SettingSelect
                                    v-model="settings.offset"
                                    :options="OFFSETS"
                                    style="font-family: 'FreeSerif'"
                                ></SettingSelect>
                            </div>
                        </SettingInputGroup>
                        <SettingToggle
                            v-model="settings.isTranspose"
                            :label="t('transpose')"
                        ></SettingToggle>
                        <SettingInputGroup v-show="settings.isTranspose" :label="t('transpose_to')">
                            <div class="flex flex-row">
                                <SettingSelect
                                    v-model="settings.transposeKey"
                                    :options="KEYS"
                                ></SettingSelect>
                                <SettingSelect
                                    v-model="settings.transposeOffset"
                                    :options="OFFSETS"
                                    style="font-family: 'FreeSerif'"
                                ></SettingSelect>
                            </div>
                        </SettingInputGroup>
                        <p v-show="settings.isTranspose" class="mb-0 text-sm text-slate-500">
                            {{ t("transpose_hint") }}
                        </p>
                        <div class="daisy-divider" />
                        <SettingToggle
                            v-model="settings.isColorNote"
                            :label="t('color_note')"
                        ></SettingToggle>
                        <SettingToggle
                            v-model="settings.isColorNoteName"
                            :label="t('color_note_name')"
                        ></SettingToggle>
                        <SettingToggle
                            v-model="settings.isDelay"
                            :label="t('delay_show')"
                        ></SettingToggle>
                        <SettingInputGroup v-show="settings.isDelay" :label="t('delay')">
                            <SettingSlider
                                v-model="settings.delay"
                                :min="100"
                                :max="1600"
                                :step="100"
                            ></SettingSlider>
                        </SettingInputGroup>
                    </div>
                </div>
            </div>
            <div class="daisy-divider daisy-divider-horizontal m-0 w-1"></div>
            <div class="daisy-card border bg-base-100">
                <div class="daisy-card-body">
                    <div class="daisy-card-title whitespace-nowrap">
                        {{ t("player_settings") }}
                    </div>
                    <div>
                        <SettingInputGroup :label="t('volume')">
                            <SettingSlider
                                v-model="settings.vol"
                                :min="0"
                                :max="1.2"
                                :step="0.1"
                            ></SettingSlider>
                        </SettingInputGroup>
                        <SettingInputGroup :label="t('duration')">
                            <SettingSlider
                                v-model="settings.duration"
                                :min="0.5"
                                :max="3"
                                :step="0.1"
                            ></SettingSlider>
                        </SettingInputGroup>
                        <SettingInputGroup :label="t('instrument')">
                            <SettingSelect
                                v-model="settings.inst"
                                :options="
                                    INSTRUMENTS.map((v) => ({ value: v.key, label: t(v.key) }))
                                "
                            ></SettingSelect
                        ></SettingInputGroup>
                        <SettingToggle
                            v-model="settings.isArpeggio"
                            :label="t('arpeggio')"
                        ></SettingToggle>
                        <SettingInputGroup v-show="settings.isArpeggio" :label="t('gap')">
                            <SettingSlider
                                v-model="settings.arpeggio"
                                :min="0.01"
                                :max="0.2"
                                :step="0.01"
                            ></SettingSlider>
                        </SettingInputGroup>
                        <div class="daisy-divider" />
                        <SettingToggle
                            v-model="settings.isActiveClick"
                            :label="t('click')"
                        ></SettingToggle>
                        <SettingToggle
                            v-model="settings.isActiveKey"
                            :label="t('shortcut')"
                        ></SettingToggle>
                        <span class="mb-0 text-sm text-slate-500">
                            ({{
                                Util.isMac() ? "Cmd" : "Ctrl"
                            }}&thinsp;+&thinsp;Shift&thinsp;+&thinsp;Space)
                        </span>
                        <SettingToggle
                            v-model="settings.isActiveHover"
                            :label="t('hover')"
                        ></SettingToggle>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

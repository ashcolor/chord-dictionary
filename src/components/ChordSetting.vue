<script setup lang="ts">
import { onMounted, watch, getCurrentInstance } from "vue";
import { useSettingsStore } from "../store/useSettings";
import { CLEFS, NOTES, OFFSETS, INSTRUMENTS, KEYS } from "../config/const";
import { Util } from "../utils/util";
import ActiveToggleButton from "./feature/setting/ActiveToggleButton.vue";
import SettingSelect from "./feature/setting/Select.vue";
import SettingSlider from "./feature/setting/Slider.vue";
import SettingToggle from "./feature/setting/Toggle.vue";
import SettingInputGroup from "./feature/setting/InputGroup.vue";
import { useI18n } from "vue-i18n";

const { t, locale, messages } = useI18n({ useScope: "global" });

const settingStore = useSettingsStore();
const { settings } = settingStore;

const instance = getCurrentInstance();

watch(
    settings,
    (newSettings) => {
        if (chrome?.storage) {
            chrome.storage.local.set({ settings: newSettings });
        }

        locale.value = newSettings.language;
        if (instance?.parent?.vnode?.el?.lang) {
            instance.parent.vnode.el.lang = t("code");
        }
    },
    { deep: true }
);

onMounted(() => {
    locale.value = settings.language;

    if (instance?.parent?.vnode?.el?.lang) {
        instance.parent.vnode.el.lang = t("code");
    }
});
</script>

<template>
    <div id="chord-dictionary-setting">
        <nav v-show="settings.isShow" id="chord-dictionary-sidebar" class="m-2">
            <div class="daisy-card border bg-base-100">
                <div class="daisy-card-body">
                    <div class="daisy-card-title">
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
                        <div class="divider" />
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
                        <div class="divider" />
                        <SettingToggle
                            v-model="settings.isShowRoman"
                            :label="t('roman_display')"
                        ></SettingToggle>
                        <SettingInputGroup :label="t('key')">
                            <SettingSelect v-model="settings.key" :options="KEYS"></SettingSelect>
                            <SettingSelect
                                v-model="settings.offset"
                                :options="OFFSETS"
                                style="font-family: 'FreeSerif'"
                            ></SettingSelect>
                        </SettingInputGroup>
                        <SettingToggle
                            v-model="settings.isTranspose"
                            :label="t('transpose')"
                        ></SettingToggle>
                        <SettingInputGroup v-show="settings.isTranspose" :label="t('transpose_to')">
                            <SettingSelect
                                v-model="settings.transposeKey"
                                :options="KEYS"
                            ></SettingSelect>
                            <SettingSelect
                                v-model="settings.transposeOffset"
                                :options="OFFSETS"
                                style="font-family: 'FreeSerif'"
                            ></SettingSelect>
                        </SettingInputGroup>
                        <p v-show="settings.isTranspose" class="small text-muted mb-0">
                            {{ t("transpose_hint") }}
                        </p>
                        <div class="divider" />
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
                            ></SettingSlider>
                        </SettingInputGroup>
                    </div>
                </div>
            </div>
            <div class="daisy-card border bg-base-100">
                <div class="daisy-card-body">
                    <div class="daisy-card-title">
                        {{ t("player_settings") }}
                    </div>
                    <div>
                        <SettingInputGroup :label="t('volume')">
                            <SettingSlider
                                v-model="settings.vol"
                                :min="0"
                                :max="1.2"
                            ></SettingSlider>
                        </SettingInputGroup>
                        <SettingInputGroup :label="t('duration')">
                            <SettingSlider
                                v-model="settings.duration"
                                :min="0.5"
                                :max="3"
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
                            ></SettingSlider>
                        </SettingInputGroup>
                        <div class="divider" />
                        <SettingToggle
                            v-model="settings.isActiveClick"
                            :label="t('click')"
                        ></SettingToggle>
                        <SettingToggle
                            v-model="settings.isActiveKey"
                            :label="t('shortcut')"
                        ></SettingToggle>
                        <span class="small text-muted mb-0">
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
        </nav>
        <ActiveToggleButton id="chord-dictionary-toggle-button" v-model="settings.isShow">
        </ActiveToggleButton>
    </div>
</template>

<style scoped>
#chord-dictionary-setting {
    text-align: left;
    display: flex;
    align-items: stretch;
}
#chord-dictionary-toggle-button {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 2147483646;
}
#chord-dictionary-sidebar {
    position: fixed;
    bottom: 60px;
    right: 12px;
    z-index: 2147483645;
}

#chord-dictionary-setting nav {
    display: flex;
}
</style>

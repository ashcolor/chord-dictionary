import { reactive, watch } from "vue";
import { defineStore } from "pinia";

export type Settings = {
    isShow: boolean;
    language: string;
    key: number;
    offset: number;
    isTranspose: boolean;
    transposeKey: number;
    transposeOffset: number;
    vol: number;
    delay: number;
    duration: number;
    arpeggio: number;
    clef: "treble" | "alto" | "bass";
    note: "whole" | "half" | "quarter";
    inst: string;
    isDelay: boolean;
    isArpeggio: boolean;
    isColorNote: boolean;
    isColorNoteName: boolean;
    isShowRoman: boolean;
    isActiveClick: boolean;
    isActiveKey: boolean;
    isActiveHover: boolean;
};

export const useSettingsStore = defineStore("settings", () => {
    const settings = reactive<Settings>({
        isShow: true,
        language: "en",
        key: 0,
        offset: 0,
        isTranspose: false,
        transposeKey: 0,
        transposeOffset: 0,
        vol: 0.84,
        delay: 600,
        duration: 1.5,
        arpeggio: 0.04,
        clef: "treble",
        note: "quarter",
        inst: "piano",
        isDelay: false,
        isArpeggio: false,
        isColorNote: false,
        isColorNoteName: false,
        isShowRoman: false,
        isActiveClick: true,
        isActiveKey: true,
        isActiveHover: false,
    });

    const getSettingsFromLocalStorage = () => {
        if (chrome?.storage) {
            chrome.storage.local.get("settings", (result) => {
                if (result) Object.assign(settings, result.settings);
                settings.language = settings.language || Util.getUserLanguageCode();
                if (settings.isShow === null) settings.isShow = true;
            });
        }
    };

    if (chrome?.runtime) {
        chrome.runtime.onMessage.addListener((_object) => {
            getSettingsFromLocalStorage();
            return true;
        });
    }

    getSettingsFromLocalStorage();

    watch(
        settings,
        (newSettings) => {
            if (chrome?.storage) {
                chrome.storage.local.set({ settings: newSettings });
            }
            if (chrome?.tabs) {
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach(function (tab) {
                        chrome.tabs.sendMessage(tab.id, { settings: newSettings });
                    });
                });
            }
        },
        { deep: true }
    );

    return { settings };
});

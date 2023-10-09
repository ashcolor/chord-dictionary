import { onMounted, watch, ref, reactive, computed } from "vue";
import { defineStore } from "pinia";

// export type Settings = {
//     id: number;
// };

export const useSettingsStore = defineStore("settings", () => {
    const settings = reactive({
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

    return { settings };
});

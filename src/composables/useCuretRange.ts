import { computed } from "vue";
import { useMouse } from "@vueuse/core";

export function useCuretRange() {
    const { x: clientX, y: clientY } = useMouse({ type: "client" });

    const caretRange = computed<Range | caretPosition | null>(() => {
        let range = null;

        if (document.caretRangeFromPoint) {
            // For Chrome
            range = document.caretRangeFromPoint(clientX.value, clientY.value);
        } else if (document.caretPositionFromPoint) {
            // For Firefox
            range = document.caretPositionFromPoint(clientX.value, clientY.value);
        } else {
            return null;
        }

        return range;
    });

    const caretRangeTextNode = computed<Range | caretPosition | null>(() => {
        if (!caretRange.value) return null;

        if (document.caretRangeFromPoint) {
            // For Chrome
            return caretRange.value.startContainer;
        } else if (document.caretPositionFromPoint) {
            // For Firefox
            return caretRange.value.offsetNode;
        }

        return null;
    });
    return {
        caretRange,
        caretRangeTextNode,
    };
}

import { ref, watch, Ref, ComputedRef } from "vue";
import { useMouse } from "@vueuse/core";
import { useEventListener } from "@vueuse/core";
import type { UseMouseOptions } from "@vueuse/core";

export interface MouseInElementOptions extends UseMouseOptions {
    handleOutside?: boolean;
}

export function useMouseInRange(target: Ref<Range | null> | ComputedRef<Range | null>) {
    const { x, y, sourceType } = useMouse();

    const targetRef = ref(target);
    const rangeTop = ref(0);
    const rangeLeft = ref(0);
    const rangeX = ref(0);
    const rangeY = ref(0);
    const rangePositionX = ref(0);
    const rangePositionY = ref(0);
    const rangeHeight = ref(0);
    const rangeWidth = ref(0);
    const isOutside = ref(true);

    let stop = () => {};

    if (window) {
        stop = watch(
            [targetRef, x, y],
            () => {
                const el = targetRef.value;
                if (!el) return;

                const { left, top, width, height } = el.getBoundingClientRect();

                rangeTop.value = top;
                rangeLeft.value = left;

                rangePositionX.value = left + window.pageXOffset;
                rangePositionY.value = top + window.pageYOffset;
                rangeHeight.value = height;
                rangeWidth.value = width;

                const elX = x.value - rangePositionX.value;
                const elY = y.value - rangePositionY.value;
                isOutside.value =
                    width === 0 ||
                    height === 0 ||
                    elX < 0 ||
                    elY < 0 ||
                    elX > width ||
                    elY > height;

                if (!isOutside.value) {
                    rangeX.value = elX;
                    rangeY.value = elY;
                }
            },
            { immediate: true }
        );

        useEventListener(document, "mouseleave", () => {
            isOutside.value = true;
        });
    }

    return {
        x,
        y,
        sourceType,
        rangeTop,
        rangeLeft,
        rangeX,
        rangeY,
        rangePositionX,
        rangePositionY,
        rangeHeight,
        rangeWidth,
        isOutside,
        stop,
    };
}

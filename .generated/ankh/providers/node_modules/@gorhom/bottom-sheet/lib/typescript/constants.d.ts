import type { SpringConfig, TimingConfig } from './types';
declare enum GESTURE_SOURCE {
    UNDETERMINED = 0,
    SCROLLABLE = 1,
    HANDLE = 2,
    CONTENT = 3
}
declare enum SHEET_STATE {
    CLOSED = 0,
    OPENED = 1,
    EXTENDED = 2,
    OVER_EXTENDED = 3,
    FILL_PARENT = 4
}
declare enum SCROLLABLE_STATUS {
    LOCKED = 0,
    UNLOCKED = 1,
    UNDETERMINED = 2
}
declare enum SCROLLABLE_TYPE {
    UNDETERMINED = 0,
    VIEW = 1,
    FLATLIST = 2,
    SCROLLVIEW = 3,
    SECTIONLIST = 4,
    VIRTUALIZEDLIST = 5
}
declare enum ANIMATION_STATUS {
    UNDETERMINED = 0,
    RUNNING = 1,
    STOPPED = 2,
    INTERRUPTED = 3
}
declare enum ANIMATION_SOURCE {
    NONE = 0,
    MOUNT = 1,
    GESTURE = 2,
    USER = 3,
    CONTAINER_RESIZE = 4,
    SNAP_POINT_CHANGE = 5,
    KEYBOARD = 6
}
declare enum ANIMATION_METHOD {
    TIMING = 0,
    SPRING = 1
}
declare enum KEYBOARD_STATUS {
    UNDETERMINED = 0,
    SHOWN = 1,
    HIDDEN = 2
}
declare enum SNAP_POINT_TYPE {
    PROVIDED = 0,
    DYNAMIC = 1
}
declare const ANIMATION_EASING: import("react-native-reanimated").EasingFunction;
declare const ANIMATION_DURATION = 250;
declare const ANIMATION_CONFIGS: TimingConfig | SpringConfig;
declare const SCROLLABLE_DECELERATION_RATE_MAPPER: {
    2: number;
    0: number;
    1: number;
};
declare const MODAL_STACK_BEHAVIOR: {
    replace: string;
    push: string;
    switch: string;
};
declare const KEYBOARD_BEHAVIOR: {
    readonly interactive: "interactive";
    readonly extend: "extend";
    readonly fillParent: "fillParent";
};
declare const KEYBOARD_BLUR_BEHAVIOR: {
    readonly none: "none";
    readonly restore: "restore";
};
declare const KEYBOARD_INPUT_MODE: {
    readonly adjustPan: "adjustPan";
    readonly adjustResize: "adjustResize";
};
declare const KEYBOARD_DISMISS_THRESHOLD = 12.5;
declare const INITIAL_LAYOUT_VALUE = -999;
declare const INITIAL_CONTAINER_LAYOUT: {
    height: number;
    offset: {
        top: number;
        bottom: number;
        right: number;
        left: number;
    };
};
export { ANIMATION_CONFIGS, ANIMATION_DURATION, ANIMATION_EASING, ANIMATION_METHOD, ANIMATION_SOURCE, ANIMATION_STATUS, GESTURE_SOURCE, INITIAL_CONTAINER_LAYOUT, INITIAL_LAYOUT_VALUE, KEYBOARD_BEHAVIOR, KEYBOARD_BLUR_BEHAVIOR, KEYBOARD_DISMISS_THRESHOLD, KEYBOARD_INPUT_MODE, KEYBOARD_STATUS, MODAL_STACK_BEHAVIOR, SCROLLABLE_DECELERATION_RATE_MAPPER, SCROLLABLE_STATUS, SCROLLABLE_TYPE, SHEET_STATE, SNAP_POINT_TYPE, };
//# sourceMappingURL=constants.d.ts.map
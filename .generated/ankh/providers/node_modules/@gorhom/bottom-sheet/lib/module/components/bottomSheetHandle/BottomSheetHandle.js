"use strict";

import React, { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { DEFAULT_ACCESSIBILITY_HINT, DEFAULT_ACCESSIBILITY_LABEL, DEFAULT_ACCESSIBILITY_ROLE, DEFAULT_ACCESSIBLE } from './constants';
import { styles } from './styles';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function BottomSheetHandleComponent({
  style,
  indicatorStyle: _indicatorStyle,
  accessible = DEFAULT_ACCESSIBLE,
  accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint = DEFAULT_ACCESSIBILITY_HINT,
  children
}) {
  //#region styles
  const containerStyle = useMemo(() => [styles.container, StyleSheet.flatten(style)], [style]);
  const indicatorStyle = useMemo(() => [styles.indicator, StyleSheet.flatten(_indicatorStyle)], [_indicatorStyle]);
  //#endregion

  // render
  return /*#__PURE__*/_jsxs(View, {
    style: containerStyle,
    accessible: accessible ?? undefined,
    accessibilityRole: accessibilityRole ?? undefined,
    accessibilityLabel: accessibilityLabel ?? undefined,
    accessibilityHint: accessibilityHint ?? undefined,
    collapsable: true,
    children: [/*#__PURE__*/_jsx(View, {
      style: indicatorStyle
    }), children]
  });
}
const BottomSheetHandle = /*#__PURE__*/memo(BottomSheetHandleComponent);
BottomSheetHandle.displayName = 'BottomSheetHandle';
export default BottomSheetHandle;
//# sourceMappingURL=BottomSheetHandle.js.map
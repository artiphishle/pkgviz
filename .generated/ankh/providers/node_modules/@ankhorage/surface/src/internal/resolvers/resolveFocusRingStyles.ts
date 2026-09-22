import type { ViewStyle } from 'react-native';

export function resolveFocusRingStyles(color: string, focused: boolean, isWeb: boolean): ViewStyle {
  if (!focused || !isWeb) {
    return {};
  }

  return {
    shadowColor: color,
    shadowOpacity: 0.22,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  };
}

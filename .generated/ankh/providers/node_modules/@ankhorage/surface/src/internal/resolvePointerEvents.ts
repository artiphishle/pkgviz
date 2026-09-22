import { Platform, type StyleProp, StyleSheet, type ViewProps, type ViewStyle } from 'react-native';

interface ResolvedPointerEvents {
  props: Pick<ViewProps, 'pointerEvents'>;
  style: StyleProp<ViewStyle>;
}

const webPointerEventStyles = StyleSheet.create({
  auto: { pointerEvents: 'auto' },
  'box-none': { pointerEvents: 'box-none' },
  'box-only': { pointerEvents: 'box-only' },
  none: { pointerEvents: 'none' },
});

export function resolvePointerEvents(
  pointerEvents: NonNullable<ViewProps['pointerEvents']>,
): ResolvedPointerEvents {
  return resolvePointerEventsForPlatform(pointerEvents, Platform.OS);
}

export function resolvePointerEventsForPlatform(
  pointerEvents: NonNullable<ViewProps['pointerEvents']>,
  platform: typeof Platform.OS,
): ResolvedPointerEvents {
  if (platform === 'web') {
    return {
      props: {},
      style: getWebPointerEventStyle(pointerEvents),
    };
  }

  return {
    props: { pointerEvents },
    style: null,
  };
}

function getWebPointerEventStyle(
  pointerEvents: NonNullable<ViewProps['pointerEvents']>,
): ViewStyle {
  switch (pointerEvents) {
    case 'auto':
      return webPointerEventStyles.auto;
    case 'box-none':
      return webPointerEventStyles['box-none'];
    case 'box-only':
      return webPointerEventStyles['box-only'];
    case 'none':
      return webPointerEventStyles.none;
  }
}

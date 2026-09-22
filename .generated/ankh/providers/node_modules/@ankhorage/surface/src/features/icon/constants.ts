import type { IconProvider } from '../../types/icon';

export const SUPPORTED_ICON_PROVIDERS = [
  'Ionicons',
  'FontAwesome',
  'FontAwesome5',
  'FontAwesome6',
  'MaterialDesignIcons',
] as const satisfies readonly IconProvider[];

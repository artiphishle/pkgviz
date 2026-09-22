import type { IconProps } from '../../../../types/icon';
import { useTheme } from '../../../theme/runtime';
import { resolveToken } from '../../../theme/utils/resolveToken';
import { PortableIcon } from './PortableIcon';

/*** Renders a theme-aware font or SVG icon through the portable icon adapter. */
export function Icon(props: IconProps) {
  const { theme } = useTheme();
  const size = props.size ?? 'm';
  const color = props.color ?? 'text';
  const resolvedSize = typeof size === 'number' ? size : resolveToken(theme.spacing, size);
  const resolvedColor = resolveToken(theme.colors, color);
  return <PortableIcon {...props} color={resolvedColor} size={resolvedSize} />;
}

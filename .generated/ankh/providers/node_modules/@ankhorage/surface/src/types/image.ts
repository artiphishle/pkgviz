import type {
  ImageProps as ReactNativeImageProps,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';

import type { SurfaceTheme } from './theme';

export type SurfaceImageSource = string | ImageSourcePropType;
export type ImageFit = ImageResizeMode;

export interface ImageProps {
  source?: SurfaceImageSource | null;
  fallbackSource?: SurfaceImageSource | null;
  alt?: string;
  accessibilityLabel?: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  fit?: ImageFit;
  resizeMode?: ImageResizeMode;
  radius?: number | keyof SurfaceTheme['radii'];
  style?: StyleProp<ImageStyle>;
  testID?: string;
  onError?: ReactNativeImageProps['onError'];
}

import fontAwesomeFont from '@react-native-vector-icons/fontawesome/fonts/FontAwesome.ttf';
import fontAwesomeGlyphs from '@react-native-vector-icons/fontawesome/glyphmaps/FontAwesome.json';
import fontAwesome5BrandFont from '@react-native-vector-icons/fontawesome5/fonts/FontAwesome5_Brands.ttf';
import fontAwesome5RegularFont from '@react-native-vector-icons/fontawesome5/fonts/FontAwesome5_Regular.ttf';
import fontAwesome5SolidFont from '@react-native-vector-icons/fontawesome5/fonts/FontAwesome5_Solid.ttf';
import fontAwesome5BrandGlyphs from '@react-native-vector-icons/fontawesome5/glyphmaps/FontAwesome5_brand.json';
import fontAwesome5RegularGlyphs from '@react-native-vector-icons/fontawesome5/glyphmaps/FontAwesome5_regular.json';
import fontAwesome5SolidGlyphs from '@react-native-vector-icons/fontawesome5/glyphmaps/FontAwesome5_solid.json';
import fontAwesome6BrandFont from '@react-native-vector-icons/fontawesome6/fonts/FontAwesome6_Brands.ttf';
import fontAwesome6RegularFont from '@react-native-vector-icons/fontawesome6/fonts/FontAwesome6_Regular.ttf';
import fontAwesome6SolidFont from '@react-native-vector-icons/fontawesome6/fonts/FontAwesome6_Solid.ttf';
import fontAwesome6BrandGlyphs from '@react-native-vector-icons/fontawesome6/glyphmaps/FontAwesome6_brand.json';
import fontAwesome6RegularGlyphs from '@react-native-vector-icons/fontawesome6/glyphmaps/FontAwesome6_regular.json';
import fontAwesome6SolidGlyphs from '@react-native-vector-icons/fontawesome6/glyphmaps/FontAwesome6_solid.json';
import ioniconsFont from '@react-native-vector-icons/ionicons/fonts/Ionicons.ttf';
import ioniconsGlyphs from '@react-native-vector-icons/ionicons/glyphmaps/Ionicons.json';
import materialDesignFont from '@react-native-vector-icons/material-design-icons/fonts/MaterialDesignIcons.ttf';
import materialDesignGlyphs from '@react-native-vector-icons/material-design-icons/glyphmaps/MaterialDesignIcons.json';
import React from 'react';
import { Image, Text, type TextStyle } from 'react-native';

import type { FontIconSource, SvgIconSource } from '../../../../types/icon';

type GlyphMap = ReadonlyMap<string, number>;

const FONT_AWESOME_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesomeGlyphs));
const FONT_AWESOME_5_BRAND_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesome5BrandGlyphs));
const FONT_AWESOME_5_REGULAR_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesome5RegularGlyphs));
const FONT_AWESOME_5_SOLID_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesome5SolidGlyphs));
const FONT_AWESOME_6_BRAND_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesome6BrandGlyphs));
const FONT_AWESOME_6_REGULAR_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesome6RegularGlyphs));
const FONT_AWESOME_6_SOLID_GLYPHS: GlyphMap = new Map(Object.entries(fontAwesome6SolidGlyphs));
const IONICONS_GLYPHS: GlyphMap = new Map(Object.entries(ioniconsGlyphs));
const MATERIAL_DESIGN_GLYPHS: GlyphMap = new Map(Object.entries(materialDesignGlyphs));

interface PortableIconPresentationProps {
  readonly color: string;
  readonly size: number;
  readonly testID?: string;
}

type WebPortableIconProps =
  | (FontIconSource &
      PortableIconPresentationProps & {
        readonly style?: React.ComponentProps<typeof Text>['style'];
      })
  | (SvgIconSource &
      PortableIconPresentationProps & {
        readonly style?: React.ComponentProps<typeof Image>['style'];
      });

/*** Renders Surface icons on web without React Native native modules or SVG codegen. */
export function PortableIcon(props: WebPortableIconProps) {
  if ('source' in props) return <WebSvgIcon {...props} />;
  return <WebFontIcon {...props} />;
}

interface WebFontDefinition {
  readonly family: string;
  readonly fontUrl: string;
  readonly glyphs: GlyphMap;
  readonly weight?: TextStyle['fontWeight'];
}

/*** Renders one RNVI glyph through the same font and codepoint used by native. */
function WebFontIcon(
  props: FontIconSource &
    PortableIconPresentationProps & {
      readonly style?: React.ComponentProps<typeof Text>['style'];
    },
) {
  const definition = resolveFontDefinition(props);
  useWebFont(definition);
  const codepoint = definition.glyphs.get(props.name);
  if (codepoint === undefined) return null;

  return (
    <Text
      accessibilityElementsHidden
      aria-hidden
      style={[
        props.style,
        {
          color: props.color,
          fontFamily: definition.family,
          fontSize: props.size,
          fontWeight: definition.weight,
          height: props.size,
          lineHeight: props.size,
          width: props.size,
        },
      ]}
      testID={props.testID}
    >
      {String.fromCodePoint(codepoint)}
    </Text>
  );
}

/*** Renders URL and bundled SVG sources through the portable web Image adapter. */
function WebSvgIcon(
  props: SvgIconSource &
    PortableIconPresentationProps & {
      readonly style?: React.ComponentProps<typeof Image>['style'];
    },
) {
  const source = typeof props.source === 'string' ? { uri: props.source } : props.source;
  return (
    <Image
      accessibilityElementsHidden
      source={source}
      style={[
        props.style,
        {
          height: props.size,
          tintColor: props.color,
          width: props.size,
        },
      ]}
      testID={props.testID}
    />
  );
}

/*** Resolve the browser font, glyph map, and weight for one existing Surface icon contract. */
function resolveFontDefinition(source: FontIconSource): WebFontDefinition {
  const runtimeProvider: unknown = source.provider;
  switch (source.provider) {
    case undefined:
    case 'Ionicons':
      return { family: 'Ionicons', fontUrl: ioniconsFont, glyphs: IONICONS_GLYPHS };
    case 'FontAwesome':
      return { family: 'FontAwesome', fontUrl: fontAwesomeFont, glyphs: FONT_AWESOME_GLYPHS };
    case 'FontAwesome5':
      return resolveFontAwesome5Definition(source.variant);
    case 'FontAwesome6':
      return resolveFontAwesome6Definition(source.variant);
    case 'MaterialDesignIcons':
      return {
        family: 'MaterialDesignIcons',
        fontUrl: materialDesignFont,
        glyphs: MATERIAL_DESIGN_GLYPHS,
      };
    default:
      throw new Error(`Unsupported icon provider: ${String(runtimeProvider)}`);
  }
}

/*** Resolve one FontAwesome5 style without invoking RNVI runtime components. */
function resolveFontAwesome5Definition(
  variant: Extract<FontIconSource, { provider: 'FontAwesome5' }>['variant'],
): WebFontDefinition {
  const runtimeVariant: unknown = variant;
  if (runtimeVariant === 'brand') {
    return {
      family: 'FontAwesome5Brands-Regular',
      fontUrl: fontAwesome5BrandFont,
      glyphs: FONT_AWESOME_5_BRAND_GLYPHS,
      weight: 400,
    };
  }
  if (runtimeVariant === 'solid') {
    return {
      family: 'FontAwesome5Free-Solid',
      fontUrl: fontAwesome5SolidFont,
      glyphs: FONT_AWESOME_5_SOLID_GLYPHS,
      weight: 900,
    };
  }
  if (runtimeVariant !== 'regular') {
    throw new Error(`Unsupported icon FontAwesome5 variant: ${String(runtimeVariant)}`);
  }
  return {
    family: 'FontAwesome5Free-Regular',
    fontUrl: fontAwesome5RegularFont,
    glyphs: FONT_AWESOME_5_REGULAR_GLYPHS,
    weight: 400,
  };
}

/*** Resolve one FontAwesome6 style without invoking RNVI runtime components. */
function resolveFontAwesome6Definition(
  variant: Extract<FontIconSource, { provider: 'FontAwesome6' }>['variant'],
): WebFontDefinition {
  const runtimeVariant: unknown = variant;
  if (runtimeVariant === 'brand') {
    return {
      family: 'FontAwesome6Brands-Regular',
      fontUrl: fontAwesome6BrandFont,
      glyphs: FONT_AWESOME_6_BRAND_GLYPHS,
      weight: 400,
    };
  }
  if (runtimeVariant === 'solid') {
    return {
      family: 'FontAwesome6Free-Solid',
      fontUrl: fontAwesome6SolidFont,
      glyphs: FONT_AWESOME_6_SOLID_GLYPHS,
      weight: 900,
    };
  }
  if (runtimeVariant !== 'regular') {
    throw new Error(`Unsupported icon FontAwesome6 variant: ${String(runtimeVariant)}`);
  }
  return {
    family: 'FontAwesome6Free-Regular',
    fontUrl: fontAwesome6RegularFont,
    glyphs: FONT_AWESOME_6_REGULAR_GLYPHS,
    weight: 400,
  };
}

/*** Register one icon font once before browser layout uses its glyphs. */
function useWebFont(definition: WebFontDefinition) {
  React.useInsertionEffect(() => {
    if (typeof document === 'undefined') return;
    const id = createFontStyleId(definition);
    if (document.getElementById(id) !== null) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = createFontFaceCss(definition);
    document.head.appendChild(style);
  }, [definition.family, definition.fontUrl, definition.weight]);
}

/*** Create a stable DOM id for one font face variant. */
function createFontStyleId(definition: WebFontDefinition): string {
  return `surface-icon-font-${definition.family}-${definition.weight ?? 'normal'}`;
}

/*** Create the browser font-face rule used by the portable font icon adapter. */
function createFontFaceCss(definition: WebFontDefinition): string {
  return `@font-face{font-family:"${definition.family}";src:url("${definition.fontUrl}") format("truetype");font-style:normal;font-weight:${definition.weight ?? 400};font-display:block;}`;
}

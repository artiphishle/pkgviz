import { readFileSync } from 'node:fs';

import { describe, expect, mock, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';

const WebImageWithoutResolveAssetSource = ({
  source,
  testID,
  tintColor,
}: {
  source?: unknown;
  testID?: string;
  tintColor?: unknown;
}) =>
  React.createElement('span', {
    'data-image-source': String(source),
    'data-testid': testID,
    'data-tint-color': String(tintColor),
  });

await mock.module('react-native', () => ({
  ...ReactNativeWeb,
  Image: WebImageWithoutResolveAssetSource,
}));
await mock.module('react-native-svg', () => ({
  SvgUri: ({ color, height, uri, width }: Record<string, unknown>) =>
    React.createElement('svg', {
      'data-color': color,
      'data-uri': uri,
      height,
      width,
    }),
}));

const { SUPPORTED_ICON_PROVIDERS } = await import('../../constants');
const { Icon } = await import('./Icon');
const { PortableIcon } = await import('./PortableIcon');

describe('portable icon rendering', () => {
  test('renders Ionicons through the public Icon API', () => {
    const markup = renderToStaticMarkup(<Icon color="#123456" name="home-outline" size={18} />);
    expect(markup).toContain('font-family:Ionicons');
  });

  test('renders FontAwesome through the public Icon API', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" name="github" provider="FontAwesome" size={18} />,
    );
    expect(markup).toContain('font-family:FontAwesome');
  });

  test('renders a FontAwesome5 brand icon through its brand font', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" name="microsoft" provider="FontAwesome5" size={18} variant="brand" />,
    );
    expect(markup).toContain('font-family:FontAwesome5Brands-Regular');
  });

  test('renders a FontAwesome5 solid icon through its solid font', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" name="video" provider="FontAwesome5" size={18} variant="solid" />,
    );
    expect(markup).toContain('font-family:FontAwesome5Free-Solid');
  });

  test('renders a FontAwesome6 brand icon through its brand font', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" name="x-twitter" provider="FontAwesome6" size={18} variant="brand" />,
    );
    expect(markup).toContain('font-family:FontAwesome6Brands-Regular');
  });

  test('renders Material Design Icons through the public Icon API', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" name="bookshelf" provider="MaterialDesignIcons" size={18} />,
    );
    expect(markup).toContain('font-family:MaterialDesignIcons');
  });

  test('renders an SVG URI through the same public Icon API', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" size={18} source="https://example.com/icons/home.svg" />,
    );
    expect(markup).toContain('data-uri="https://example.com/icons/home.svg"');
    expect(markup).toContain('data-color="#123456"');
    expect(markup).toContain('width="18"');
    expect(markup).toContain('height="18"');
  });
});

describe('portable icon web assets', () => {
  test('renders a bundled SVG asset through React Native Web Image', () => {
    const markup = renderToStaticMarkup(
      <Icon color="#123456" size={18} source={42} testID="bundled-svg" />,
    );
    expect(markup).toContain('data-image-source="42"');
    expect(markup).toContain('data-testid="bundled-svg"');
    expect(markup).toContain('data-tint-color="#123456"');
  });
});

describe('portable icon contract', () => {
  test('publishes the intentional provider inventory', () => {
    expect(SUPPORTED_ICON_PROVIDERS.length).toBeGreaterThan(0);
    expect(new Set(SUPPORTED_ICON_PROVIDERS).size).toBe(SUPPORTED_ICON_PROVIDERS.length);
  });
});

describe('portable icon runtime rejection', () => {
  test('throws for an invalid runtime provider instead of falling back to Ionicons', () => {
    const props = {
      color: '#123456',
      name: 'home-outline',
      size: 18,
    } satisfies Parameters<typeof PortableIcon>[0];
    Object.defineProperty(props, 'provider', { enumerable: true, value: 'UnknownIcons' });

    expect(() => renderToStaticMarkup(<PortableIcon {...props} />)).toThrow(
      'Unsupported icon provider: UnknownIcons',
    );
  });

  test('throws for an invalid runtime FontAwesome5 variant', () => {
    const props = {
      color: '#123456',
      name: 'video',
      provider: 'FontAwesome5',
      size: 18,
      variant: 'solid',
    } satisfies Parameters<typeof PortableIcon>[0];
    Object.defineProperty(props, 'variant', { value: 'duotone' });

    expect(() => renderToStaticMarkup(<PortableIcon {...props} />)).toThrow(
      'Unsupported icon FontAwesome5 variant: duotone',
    );
  });

  test('throws for an invalid runtime FontAwesome6 variant', () => {
    const props = {
      color: '#123456',
      name: 'x-twitter',
      provider: 'FontAwesome6',
      size: 18,
      variant: 'brand',
    } satisfies Parameters<typeof PortableIcon>[0];
    Object.defineProperty(props, 'variant', { value: 'duotone' });

    expect(() => renderToStaticMarkup(<PortableIcon {...props} />)).toThrow(
      'Unsupported icon FontAwesome6 variant: duotone',
    );
  });
});

describe('portable icon dependency boundary', () => {
  test('has no Expo icon dependency or resolver path', () => {
    const packageSource = readFileSync(
      new URL('../../../../../package.json', import.meta.url),
      'utf8',
    );
    const iconSource = readFileSync(new URL('./PortableIcon.tsx', import.meta.url), 'utf8');

    expect(packageSource).not.toContain('@expo/vector-icons');
    expect(packageSource).not.toContain('expo-font');
    expect(iconSource).not.toContain('resolveExpoIconComponent');
    expect(iconSource).not.toContain("from 'expo");
  });
});

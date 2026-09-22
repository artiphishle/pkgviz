import { describe, expect, it } from 'bun:test';

import { createTheme } from '../../theme/application/use-cases/createTheme';
import { getSourceKey } from './getSourceKey';
import { normalizeSource } from './normalizeSource';
import { resolveImageStyle } from './resolveImageStyle';
import { resolveRenderedSource } from './resolveRenderedSource';
import { resolveResizeMode } from './resolveResizeMode';

describe('normalizeSource', () => {
  it('normalizes string sources into uri objects', () => {
    expect(normalizeSource('https://example.com/image.png')).toEqual({
      uri: 'https://example.com/image.png',
    });
  });
  it('passes through react-native image sources', () => {
    expect(normalizeSource({ uri: 'https://example.com/image.png' })).toEqual({
      uri: 'https://example.com/image.png',
    });
  });
  it('returns undefined for nullish sources', () => {
    expect(normalizeSource(null)).toBeUndefined();
    expect(normalizeSource(undefined)).toBeUndefined();
  });
});

describe('resolveResizeMode', () => {
  it('prefers fit over resizeMode', () => {
    expect(resolveResizeMode('contain', 'cover')).toBe('contain');
  });
  it('defaults to cover when both are absent', () => {
    expect(resolveResizeMode(undefined, undefined)).toBe('cover');
  });
});

describe('resolveRenderedSource', () => {
  it('renders fallback when the primary source is absent', () => {
    const fallback = normalizeSource('https://example.com/fallback.png');
    expect(resolveRenderedSource(undefined, fallback, false)).toEqual(fallback);
  });
});

describe('getSourceKey', () => {
  it('derives stable keys for string and uri sources', () => {
    expect(getSourceKey('https://example.com/image.png')).toBe('uri:https://example.com/image.png');
    expect(getSourceKey({ uri: 'https://example.com/image.png' })).toBe(
      'uri:https://example.com/image.png',
    );
  });
  it('derives stable keys for asset sources', () => expect(getSourceKey(12)).toBe('asset:12'));
  it('derives stable keys for uri sets', () => {
    expect(getSourceKey([{ uri: 'a' }, { uri: 'b' }])).toBe('uri-set:a|b');
  });
});

describe('resolveImageStyle', () => {
  it('resolves spacing tokens for dimensions and preserves raw strings', () => {
    const theme = createTheme();
    const style = resolveImageStyle(theme, { width: 'm', height: '100%' });
    expect(style.width).toBe(theme.spacing.m);
    expect(style.height).toBe('100%');
  });
  it('resolves radius tokens for borderRadius', () => {
    const theme = createTheme();
    const style = resolveImageStyle(theme, { radius: 'full' });
    expect(style.borderRadius).toBe(theme.radii.full);
    expect(style.overflow).toBe('hidden');
  });
});

import { describe, expect, test } from 'bun:test';

import { resolvePointerEventsForPlatform } from './resolvePointerEvents';

describe('resolvePointerEvents', () => {
  test('moves React Native Web pointer events into style', () => {
    expect(resolvePointerEventsForPlatform('box-none', 'web')).toEqual({
      props: {},
      style: { pointerEvents: 'box-none' },
    });
  });

  test('preserves the native pointer-events prop', () => {
    expect(resolvePointerEventsForPlatform('none', 'ios')).toEqual({
      props: { pointerEvents: 'none' },
      style: null,
    });
  });
});

import { describe, expect, it } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { useBottomSheet } from './useBottomSheet';

describe('useBottomSheet', () => {
  it('requires BottomSheetProvider', () => {
    function Consumer() {
      useBottomSheet();
      return null;
    }

    expect(() => renderToStaticMarkup(<Consumer />)).toThrow(
      'useBottomSheet must be used within BottomSheetProvider.',
    );
  });
});

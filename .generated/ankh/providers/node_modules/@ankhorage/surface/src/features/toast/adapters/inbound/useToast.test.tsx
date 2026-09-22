import { describe, expect, it } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { useToast } from './useToast';

describe('useToast', () => {
  it('requires ToastProvider', () => {
    function Consumer() {
      useToast();
      return null;
    }

    expect(() => renderToStaticMarkup(<Consumer />)).toThrow(
      'useToast must be used within <ToastProvider>.',
    );
  });
});

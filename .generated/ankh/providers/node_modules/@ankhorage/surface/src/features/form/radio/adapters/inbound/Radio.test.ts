import { expect, test } from 'bun:test';
import React from 'react';

import { isRadioTextContent } from '../../utils/isRadioTextContent';

test('classifies only primitive labels for the built-in text presentation', () => {
  expect(isRadioTextContent('Option')).toBe(true);
  expect(isRadioTextContent(7)).toBe(true);
  expect(isRadioTextContent(React.createElement('span', null, 'Structured'))).toBe(false);
  expect(isRadioTextContent(null)).toBe(false);
});

test('Radio preserves one radio interaction boundary and renders structured content directly', async () => {
  const source = await Bun.file(new URL('./Radio.tsx', import.meta.url)).text();
  expect(source).toContain('accessibilityRole="radio"');
  expect(source).toContain('accessibilityState={{ checked: isChecked }}');
  expect(source).toContain('isRadioTextContent(input.children)');
  expect(source).toContain('<Text emphasis={labelEmphasis}>{input.children}</Text>');
  expect(source).toMatch(/:\s*\(\s*input\.children\s*\)/);
});

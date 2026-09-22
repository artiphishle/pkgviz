import { expect, test } from 'bun:test';

test('Tooltip delegates anchored positioning and portal ownership to Popover', async () => {
  const source = await Bun.file('src/features/tooltip/adapters/inbound/Tooltip.tsx').text();

  expect(source).toContain("import { Popover } from '../../../popover/public';");
  expect(source).toContain('<Popover');
  expect(source).not.toContain('measureInWindow');
  expect(source).not.toContain('internal/overlay');
  expect(source).not.toContain('<Portal');
});

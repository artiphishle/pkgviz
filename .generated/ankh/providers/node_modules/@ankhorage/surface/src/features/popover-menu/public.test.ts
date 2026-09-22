import { expect, test } from 'bun:test';

test('PopoverMenu composes Popover instead of owning anchor and portal mechanics', async () => {
  const source = await Bun.file(
    'src/features/popover-menu/adapters/inbound/PopoverMenu.tsx',
  ).text();

  expect(source).toContain("import { Popover } from '../../../popover/public';");
  expect(source).toContain('<Popover');
  expect(source).not.toContain('measureInWindow');
  expect(source).not.toContain('internal/overlay');
  expect(source).not.toContain('<Portal');
});

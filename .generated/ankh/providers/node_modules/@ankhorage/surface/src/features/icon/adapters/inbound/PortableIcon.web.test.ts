import { expect, test } from 'bun:test';

import type { PortableIcon } from './PortableIcon.web';

type WebPortableIcon = typeof PortableIcon;

test('web icon adapter remains a native-free platform boundary', async () => {
  const portableIconType: WebPortableIcon | undefined = undefined;
  expect(portableIconType).toBeUndefined();

  const source = await Bun.file('src/features/icon/adapters/inbound/PortableIcon.web.tsx').text();

  expect(source).not.toContain('react-native-svg');
  expect(source).not.toContain('/static');
  expect(source).toContain('/glyphmaps/');
  expect(source).toContain('/fonts/');
});

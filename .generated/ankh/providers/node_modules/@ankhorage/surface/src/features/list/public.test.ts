import { expect, test } from 'bun:test';

test('list capability owns List and ListItem under one feature boundary', async () => {
  const listSource = await Bun.file('src/features/list/adapters/inbound/List.tsx').text();
  const listItemSource = await Bun.file('src/features/list/adapters/inbound/ListItem.tsx').text();

  expect(listSource).toContain('export function List');
  expect(listItemSource).toContain('export function ListItem');
  expect(listItemSource).toContain('interactionPolicy={props.interactionPolicy}');
  expect(listItemSource).toContain('selected');
  expect(listItemSource).toContain('compact');
  expect(listItemSource).not.toContain('components/list-item');
});

import { expect, mock, test } from 'bun:test';
import * as ReactNativeWeb from 'react-native-web';

await mock.module('react-native', () => ReactNativeWeb);

const [
  { BottomSheetFlatList },
  { BottomSheetProvider },
  { BottomSheetScrollView },
  { BottomSheetSectionList },
  { BottomSheetView },
  { BottomSheetVirtualizedList },
] = await Promise.all([
  import('./BottomSheetFlatList.web'),
  import('./BottomSheetProvider.web'),
  import('./BottomSheetScrollView.web'),
  import('./BottomSheetSectionList.web'),
  import('./BottomSheetView.web'),
  import('./BottomSheetVirtualizedList.web'),
]);

test('web bottom-sheet adapters load without Gorhom runtime components', () => {
  for (const component of [
    BottomSheetFlatList,
    BottomSheetProvider,
    BottomSheetScrollView,
    BottomSheetSectionList,
    BottomSheetView,
    BottomSheetVirtualizedList,
  ]) {
    expect(component).toBeDefined();
  }
});

import React from 'react';
import {
  type LayoutChangeEvent,
  type LayoutRectangle,
  useWindowDimensions,
  type View,
} from 'react-native';

import type { PopoverPlacement } from '../../../../types/popover';
import { resolvePopoverPosition } from '../../utils/resolvePopoverPosition';

/*** Measures the anchor and resolves the current viewport-safe popover position. */
export function usePopoverLayout({ anchorRef, offset, open, placement }: UsePopoverLayoutInput) {
  const [anchorLayout, setAnchorLayout] = React.useState<LayoutRectangle | null>(null);
  const [contentSize, setContentSize] = React.useState({ height: 0, width: 0 });
  const { height: viewportHeight, width: viewportWidth } = useWindowDimensions();

  const measureAnchor = React.useCallback(() => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      setAnchorLayout({ height, width, x, y });
    });
  }, [anchorRef]);

  React.useEffect(() => {
    if (open) measureAnchor();
  }, [measureAnchor, open]);

  const onContentLayout = React.useCallback((event: LayoutChangeEvent) => {
    setContentSize(event.nativeEvent.layout);
  }, []);

  const position = anchorLayout
    ? resolvePopoverPosition({
        anchor: anchorLayout,
        contentSize,
        offset,
        placement,
        viewport: { height: viewportHeight, width: viewportWidth },
        viewportPadding: 8,
      })
    : undefined;

  return { measureAnchor, onContentLayout, position, ready: Boolean(anchorLayout) };
}

interface UsePopoverLayoutInput {
  anchorRef: React.RefObject<View | null>;
  offset: number;
  open: boolean;
  placement: PopoverPlacement;
}

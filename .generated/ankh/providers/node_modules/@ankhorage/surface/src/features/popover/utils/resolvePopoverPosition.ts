import type { PopoverPlacement } from '../../../types/popover';

/*** Resolves a viewport-clamped anchored position for popover content. */
export function resolvePopoverPosition({
  anchor,
  contentSize,
  offset,
  placement,
  viewport,
  viewportPadding,
}: {
  anchor: { height: number; width: number; x: number; y: number };
  contentSize: { height: number; width: number };
  offset: number;
  placement: PopoverPlacement;
  viewport: { height: number; width: number };
  viewportPadding: number;
}): { left: number; top: number } {
  const anchorCenterX = anchor.x + anchor.width / 2;
  const rawLeft = placement.endsWith('-start')
    ? anchor.x
    : placement.endsWith('-end')
      ? anchor.x + anchor.width - contentSize.width
      : anchorCenterX - contentSize.width / 2;
  const rawTop = placement.startsWith('top')
    ? anchor.y - contentSize.height - offset
    : anchor.y + anchor.height + offset;
  const maxLeft = Math.max(viewportPadding, viewport.width - contentSize.width - viewportPadding);
  const maxTop = Math.max(viewportPadding, viewport.height - contentSize.height - viewportPadding);

  return {
    left: clamp(rawLeft, viewportPadding, maxLeft),
    top: clamp(rawTop, viewportPadding, maxTop),
  };
}

/*** Clamps one numeric position into the available viewport range. */
function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

'use client';
import { IconButton } from '@zora/button';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import type { GraphViewController } from '@zora/graph-view';
import type { ChangeEvent } from 'react';

import type { ZoraMode } from '@/types/zora';

interface GraphZoomControlsProps {
  readonly controller: GraphViewController | null;
  readonly maxZoom: number;
  readonly minZoom: number;
  readonly mode: ZoraMode;
  readonly zoom: number;
}

/*** Renders graph zoom controls through ZORA except for the retained range slider. */
export function GraphZoomControls({
  controller,
  maxZoom,
  minZoom,
  mode,
  zoom,
}: GraphZoomControlsProps) {
  /*** Applies one slider zoom value through the GraphView controller. */
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (controller === null) return;
    const level = Number.parseFloat(event.target.value);
    controller.setZoom(Math.min(maxZoom, Math.max(minZoom, level)));
  };

  return (
    <View mode={mode} align="center" direction="row" gap="s" justify="center" p="m">
      <Text mode={mode} variant="bodySmall">
        Zoom:
      </Text>
      <IconButton
        color="neutral"
        icon={{ name: 'scan-outline' }}
        label="Zoom to fit"
        mode={mode}
        size="s"
        variant="ghost"
        onPress={() => controller?.fit()}
      />
      <input
        id="zoom"
        type="range"
        min={minZoom}
        max={maxZoom}
        step="0.05"
        value={zoom}
        onChange={handleSliderChange}
        className="w-64"
        aria-label="Zoom"
      />
      <Text mode={mode} variant="caption">
        {(zoom * 100).toFixed(0)}%
      </Text>
    </View>
  );
}

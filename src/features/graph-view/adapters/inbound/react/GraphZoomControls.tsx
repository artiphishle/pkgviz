'use client';
import { IconButton } from '@zora/button';
import type { GraphViewController } from '@zora/graph-view';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import React, { type ChangeEvent } from 'react';

interface GraphZoomControlsProps {
  readonly controller: GraphViewController | null;
  readonly maxZoom: number;
  readonly minZoom: number;
  readonly zoom: number;
}

/*** Renders graph zoom controls through ZORA except for the retained range slider. */
export function GraphZoomControls({ controller, maxZoom, minZoom, zoom }: GraphZoomControlsProps) {
  /*** Applies one slider zoom value through the GraphView controller. */
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (controller === null) return;
    const level = Number.parseFloat(event.target.value);
    controller.setZoom(Math.min(maxZoom, Math.max(minZoom, level)));
  };

  return (
    <View align="center" direction="row" gap="s" justify="center" p="m">
      <Text variant="bodySmall">Zoom:</Text>
      <IconButton
        color="neutral"
        icon={{ name: 'scan-outline' }}
        label="Fit graph and optimize spacing for readability"
        size="s"
        variant="ghost"
        onPress={() => controller?.fit({ optimizeSpacing: true })}
      />
      <input
        id="zoom"
        type="range"
        min={minZoom}
        max={maxZoom}
        step="any"
        value={zoom}
        onChange={handleSliderChange}
        className="w-64"
        aria-label="Zoom"
      />
      <Text variant="caption">{(zoom * 100).toFixed(0)}%</Text>
    </View>
  );
}

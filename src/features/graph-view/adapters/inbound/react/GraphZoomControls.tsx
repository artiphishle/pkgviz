'use client';

import type { GraphViewController } from '@zora/graph-view';
import { CircleDotDashedIcon } from 'lucide-react';
import React, { type ChangeEvent } from 'react';

interface GraphZoomControlsProps {
  readonly controller: GraphViewController | null;
  readonly maxZoom: number;
  readonly minZoom: number;
  readonly zoom: number;
}

/*** Renders graph zoom controls against the engine-neutral ZORA viewport controller. */
export function GraphZoomControls({ controller, maxZoom, minZoom, zoom }: GraphZoomControlsProps) {
  /*** Applies one slider zoom value through the GraphView controller. */
  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (controller === null) return;
    const level = Number.parseFloat(event.target.value);
    controller.setZoom(Math.min(maxZoom, Math.max(minZoom, level)));
  };

  return (
    <div className="flex shrink-0 items-center justify-center gap-2 border-t border-t-gray-200 p-4 dark:border-t-gray-800">
      <label htmlFor="zoom">Zoom:</label>
      <button
        type="button"
        title="Fit graph and optimize spacing for readability"
        aria-label="Fit graph and optimize spacing for readability"
        onClick={() => controller?.fit({ optimizeSpacing: true })}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <CircleDotDashedIcon className="cursor-pointer" />
      </button>
      <input
        id="zoom"
        type="range"
        min={minZoom}
        max={maxZoom}
        step="any"
        value={zoom}
        onChange={handleSliderChange}
        className="w-64"
      />
      <span className="text-sm">{(zoom * 100).toFixed(0)}%</span>
    </div>
  );
}

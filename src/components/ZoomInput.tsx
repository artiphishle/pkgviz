'use client';
import React, { useEffect, useState } from 'react';
import { Core } from 'cytoscape';
import { CircleDotDashedIcon } from 'lucide-react';

interface IZoomInput {
  readonly cyInstance: Core | null;
}

export default function ZoomInput({ cyInstance }: IZoomInput) {
  const [zoom, setZoom] = useState<number>(1);
  const [minZoom, setMinZoom] = useState<number>(0.1);
  const [maxZoom, setMaxZoom] = useState<number>(2);

  // Sync initial zoom + bounds + subscribe to zoom events
  useEffect(() => {
    if (!cyInstance) return;

    // Initialize from cy
    setZoom(cyInstance.zoom());
    setMinZoom(cyInstance.minZoom());
    setMaxZoom(cyInstance.maxZoom());

    const handleZoom = () => {
      setZoom(cyInstance.zoom());
    };

    cyInstance.on('zoom', handleZoom);

    return () => {
      cyInstance.off('zoom', handleZoom);
    };
  }, [cyInstance]);

  // Slider change -> set zoom, anchored at viewport centre
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!cyInstance) return;
    const level = parseFloat(e.target.value);

    // Clamp to current min/max just in case
    const clamped = Math.min(maxZoom, Math.max(minZoom, level));

    // Anchor zoom around the canvas centre (in rendered coords)
    const renderedPosition = {
      x: cyInstance.width() / 2,
      y: cyInstance.height() / 2,
    };

    cyInstance.zoom({ level: clamped, renderedPosition });
    setZoom(clamped);
  };

  // Zoom to fit button
  const handleZoomToFit = () => {
    if (!cyInstance) return;

    // Fit all elements with a bit of padding
    cyInstance.fit(undefined, 50);

    const nextZoom = cyInstance.zoom();
    setZoom(nextZoom);
    // If you want, you could also refresh min/max here:
    // setMinZoom(cyInstance.minZoom());
    // setMaxZoom(cyInstance.maxZoom());
  };

  return (
    <div className="p-4 flex items-center justify-center gap-2 border-t border-t-gray-200 dark:border-t-gray-800">
      <label htmlFor="zoom">Zoom:</label>

      <button
        type="button"
        title="Zoom to fit"
        onClick={handleZoomToFit}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <CircleDotDashedIcon className="cursor-pointer" />
      </button>

      <input
        id="zoom"
        type="range"
        min={minZoom}
        max={maxZoom}
        step="0.05"
        value={zoom}
        onChange={handleSliderChange}
        className="w-64"
      />

      <span className="text-sm">{(zoom * 100).toFixed(0)}%</span>
    </div>
  );
}

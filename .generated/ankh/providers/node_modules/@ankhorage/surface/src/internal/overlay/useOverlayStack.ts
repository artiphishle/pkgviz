import React from 'react';

import { type OverlayLayer, resolveOverlayZIndex } from '../resolvers/resolveOverlayZIndex';

export interface OverlayEntry {
  id: string;
  layer: OverlayLayer;
  node: React.ReactNode;
  order: number;
  zIndex: number;
}

export interface OverlayDescriptor {
  layer: OverlayLayer;
  node: React.ReactNode;
}

export interface OverlayStackActions {
  setOverlay: (id: string, overlay: OverlayDescriptor) => void;
  removeOverlay: (id: string) => void;
}

export interface OverlayStackRuntime extends OverlayStackActions {
  overlays: OverlayEntry[];
}

export function sortOverlayEntries(entries: OverlayEntry[]): OverlayEntry[] {
  const perLayerCounts: Partial<Record<OverlayLayer, number>> = {};
  const normalizedEntries = [...entries]
    .sort((left, right) => left.order - right.order)
    .map((entry) => {
      const stackIndex = perLayerCounts[entry.layer] ?? 0;
      perLayerCounts[entry.layer] = stackIndex + 1;

      return {
        ...entry,
        zIndex: resolveOverlayZIndex(entry.layer, stackIndex),
      };
    });

  return normalizedEntries.sort((left, right) =>
    left.zIndex === right.zIndex ? left.order - right.order : left.zIndex - right.zIndex,
  );
}

export const OverlayStackContext = React.createContext<OverlayStackRuntime | null>(null);

export const OverlayStackActionsContext = React.createContext<OverlayStackActions | null>(null);

export function useOverlayStackActions(): OverlayStackActions | null {
  return React.use(OverlayStackActionsContext);
}

export function createOverlayEntry(
  id: string,
  order: number,
  descriptor: OverlayDescriptor,
): OverlayEntry {
  return {
    id,
    layer: descriptor.layer,
    node: descriptor.node,
    order,
    zIndex: resolveOverlayZIndex(descriptor.layer, 0),
  };
}

'use client';
import type { Core, ElementsDefinition, LayoutOptions, Stylesheet } from 'cytoscape';
import { useTheme } from 'next-themes';
import type { RefObject } from 'react';
import { useEffect } from 'react';

import {
  getBreadthfirstStyle,
  getCircleStyle,
  getConcentricStyle,
  getElkStyle,
  getGridStyle,
} from '@/layouts';
import { getCanvasBg, getStyle as getCommonStyle } from '@/layouts/style';

/*** Applies theme and layout-specific Cytoscape styles without owning data or layout lifecycle. */
export function useGraphStyles(input: UseGraphStylesInput) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (input.cy === null || input.visibleElements === null || input.containerRef.current === null) {
      return;
    }
    input.cy
      .style([
        ...getCommonStyle(input.visibleElements, theme),
        ...getLayoutStyle(input.layout),
      ])
      .update();
    input.containerRef.current.style.background = getCanvasBg(theme);
  }, [input.containerRef, input.cy, input.layout, input.visibleElements, theme]);
}

interface UseGraphStylesInput {
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly cy: Core | null;
  readonly layout: LayoutOptions['name'];
  readonly visibleElements: ElementsDefinition | null;
}

/*** Resolves the visual style extension owned by the active layout. */
function getLayoutStyle(layout: LayoutOptions['name']): Stylesheet[] {
  if (layout === 'breadthfirst') return getBreadthfirstStyle();
  if (layout === 'circle') return getCircleStyle();
  if (layout === 'elk') return getElkStyle();
  if (layout === 'grid') return getGridStyle();
  return getConcentricStyle();
}

import type { GraphViewStyleRule } from '@zora/graph-view';
import type { ElementsDefinition, LayoutOptions, StylesheetJson } from 'cytoscape';

import {
  getBreadthfirstStyle,
  getCircleStyle,
  getConcentricStyle,
  getElkStyle,
  getGridStyle,
} from '@/layouts';
import { getStyle as getCommonStyle, type ThemeKey } from '@/layouts/style';

/*** Builds ZORA GraphView style rules from the existing PKGViz Cytoscape style policy. */
export function createGraphViewStyles(
  elements: ElementsDefinition,
  theme: ThemeKey,
  layout: LayoutOptions['name']
): readonly GraphViewStyleRule[] {
  return [...getCommonStyle(elements, theme), ...getLayoutStyle(layout)].map(toGraphViewStyleRule);
}

/*** Converts one Cytoscape stylesheet rule into the GraphView presentation contract. */
function toGraphViewStyleRule(rule: StylesheetJson[number]): GraphViewStyleRule {
  return {
    selector: rule.selector,
    style: { ...('style' in rule ? rule.style : rule.css) },
  };
}

/*** Resolves the visual style extension owned by the active layout. */
function getLayoutStyle(layout: LayoutOptions['name']): StylesheetJson {
  if (layout === 'breadthfirst') return getBreadthfirstStyle();
  if (layout === 'circle') return getCircleStyle();
  if (layout === 'elk') return getElkStyle();
  if (layout === 'grid') return getGridStyle();
  return getConcentricStyle();
}

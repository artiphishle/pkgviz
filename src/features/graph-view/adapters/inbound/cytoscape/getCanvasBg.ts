import {
  getGraphPalette,
  type ThemeKey,
} from '@/features/graph-view/adapters/inbound/cytoscape/getGraphPalette';

/*** Returns the canvas background for the active graph theme. */
export function getCanvasBg(theme: ThemeKey): string {
  return getGraphPalette(theme).canvasBg;
}

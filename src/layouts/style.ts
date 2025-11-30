import type { ElementsDefinition, StylesheetJson } from 'cytoscape';

import { getWeightBuckets } from '@/layouts/getWeightBuckets';

export type ThemeKey = 'dark' | 'light';

const palette = {
  light: {
    canvasBg: '#ffffff',
    edge: '#9E9E9E',
    weightXs: '#B0B0B0',
    weightMd: '#7A7A7A',
    weightXl: '#424242',

    nodeBg: '#FFFFFF',
    nodeBorder: '#D0D7DE',
    nodeText: '#222222',

    selectedFill: '#E8F1FF',
    selectedRing: '#0B5FFF',
    selectedText: '#0B5FFF',
  },
  dark: {
    canvasBg: '#171717',
    edge: '#707070',
    weightXs: '#5A5A5A',
    weightMd: '#8A8A8A',
    weightXl: '#C0C0C0',

    nodeBg: '#1E2533',
    nodeBorder: '#2A3A4A',
    nodeText: '#E8F0FF',

    selectedFill: '#2E6FFF',
    selectedRing: '#BBD3FF',
    selectedText: '#FFFFFF',
  },
} as const;

export const getCanvasBg = (theme: ThemeKey) => palette[theme].canvasBg;

export function getStyle(filteredElements: ElementsDefinition, theme: ThemeKey): StylesheetJson {
  const colors = palette[theme];
  const { thresholds } = getWeightBuckets(3, 'linear', filteredElements);

  return [
    {
      selector: 'node',
      style: {
        shape: 'bottom-round-rectangle',
        'background-color': colors.nodeBg,
        'border-color': colors.nodeBorder,
        color: colors.nodeText,
        label: 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        width: 'label',
        height: 'label',
        padding: '8px 8px',
        'border-width': 1,
        'font-size': '14px',
        'overlay-opacity': 0, // avoid gray overlay
      },
    },
    { selector: 'node.isParent', style: { 'font-weight': 'bold' } },
    { selector: 'node.packageCycle', style: { 'border-color': '#d80303', 'border-width': 3 } },
    {
      selector: 'node:selected',
      style: {
        'background-color': colors.selectedFill,
        'border-color': colors.selectedRing,
        'border-width': 3,
        color: colors.selectedText,

        'background-opacity': 1,
        opacity: 1,
        'overlay-opacity': 0,

        // Keep labels readable
        'text-outline-color': theme === 'dark' ? '#000000' : '#FFFFFF',
        'text-outline-width': 1,
      },
    },
    {
      selector: 'node:selected.hushed',
      style: { 'background-opacity': 1, opacity: 1 },
    },
    {
      selector: 'node:parent, node:parent:selected',
      style: {
        color: colors.nodeText,
        'border-width': 1,
        'border-color': colors.nodeBorder,
        'text-valign': 'top',
        'text-margin-y': 20,
        padding: '10px',
        'padding-top': '20px',
        'text-halign': 'center',
        'font-size': 14,
      },
    },
    {
      selector: 'edge',
      style: {
        'arrow-scale': 1,
        'target-arrow-color': colors.edge,
        'target-arrow-shape': 'chevron',
        'target-arrow-fill': 'filled',
        'line-color': colors.edge,
        'curve-style': 'straight',
        opacity: 1,
        'line-opacity': 1,
      },
    },
    {
      selector: 'edge.hushed',
      style: {
        opacity: 0.2, // affects the entire edge (incl. arrows)
        'line-opacity': 0.4, // extra fade for the stroke
        'line-color': colors.edge,
        'target-arrow-color': colors.edge,
        'source-arrow-color': colors.edge,
      },
    },
    {
      selector: 'edge.highlight-outgoer, edge.highlight-incomer, edge.highlight-dependency',
      style: {
        opacity: 1,
        'line-opacity': 1,
        width: 4,
        'line-color': colors.weightXl,
        'target-arrow-color': colors.weightXl,
        'source-arrow-color': colors.weightXl,
      },
    },
    { selector: 'edge[weight <= 1]', style: { label: '' } },
    {
      selector: `edge[weight > 1][weight <= ${thresholds[0]}]`,
      style: {
        width: 1,
        'line-color': colors.weightXs,
        'target-arrow-color': colors.weightXs,
      },
    },
    {
      selector: `edge[weight > ${thresholds[0]}][weight <= ${thresholds[1]}]`,
      style: {
        width: 4,
        'arrow-scale': 2,
        'line-color': colors.weightMd,
        'target-arrow-color': colors.weightMd,
      },
    },
    {
      selector: `edge[weight > ${thresholds[1]}]`,
      style: {
        width: 8,
        'line-color': colors.weightXl,
        'target-arrow-color': colors.weightXl,
      },
    },
    {
      selector: 'edge.packageCycle',
      style: { 'line-color': '#d80303', 'target-arrow-color': '#d80303' },
    },
    {
      selector: 'edge.packageCycle',
      style: { 'line-color': '#d80303', 'target-arrow-color': '#d80303' },
    },
  ];
}

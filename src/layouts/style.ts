import type { ElementsDefinition, NodeSingular, StylesheetJson } from 'cytoscape';

import { getWeightBuckets } from '@/layouts/getWeightBuckets';

export type ThemeKey = 'dark' | 'light';

const palette = {
  light: {
    canvasBg: '#ffffff',
    // edge: '#9E9E9E',
    edge: '#000',
    weightXs: '#000',
    weightMd: '#000',
    weightXl: '#000',

    nodeBg: '#E8F1FF',
    nodeBorder: '#0B5FFF',
    nodeText: '#0B5FFF',

    selectedFill: '#0B5FFF',
    selectedRing: '#0B5FFF',
    selectedText: '#FFF',
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
        label: 'data(name)',
        'text-valign': 'center',
        'text-halign': 'center',
        width: (node: NodeSingular) => {
          return node.data('name').length * 7;
        },
        height: (node: NodeSingular) => {
          return node.height() / 2 + 10;
        },
        padding: '8px 8px',
        'border-width': 1,
        'font-size': '14px',
        'overlay-opacity': 0, // avoid gray overlay
      },
    },
    { selector: 'node.packageCycle', style: { 'border-color': '#d80303', 'border-width': 3 } },
    { selector: 'node.isParent', style: { 'font-weight': 'bold' } },
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
      },
    },
    {
      selector: 'node:parent, node:parent:selected',
      style: {
        'background-opacity': 0.3,
        'background-color': colors.selectedFill,
        color: colors.nodeText,
        'border-width': 2,
        'border-color': colors.nodeBorder,
        'text-valign': 'top',
        'text-margin-y': -5,
        padding: '10px',
        'padding-top': '20px',
        'text-halign': 'center',
        'font-size': 14,
        'font-weight': 'bold',
        'font-style': 'italic',
        label: 'data(name)',
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
        opacity: 0.1, // affects the entire edge (incl. arrows)
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

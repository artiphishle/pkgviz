export type ThemeKey = 'dark' | 'light';

const palette = {
  light: {
    canvasBg: '#ffffff',
    edge: '#000',
    weightXs: '#000',
    weightMd: '#000',
    weightXl: '#000',

    nodeBg: '#E8F1FF',
    nodeBorder: '#0B5FFF',
    nodeBorderVendor: '#E2D5FF',
    nodeBgVendor: '#D1C4FF',
    nodeText: '#0B5FFF',
    compoundBg: '#7892B3',

    selectedFill: '#0B5FFF',
    selectedFillVendor: '#a025aa',
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
    nodeBgVendor: '#241431',
    nodeBorder: '#2A3A4A',
    nodeBorderVendor: '#351542',
    nodeText: '#E8F0FF',
    compoundBg: '#A9BCD5',

    selectedFill: '#2E6FFF',
    selectedFillVendor: '#4E25AA',
    selectedRing: '#BBD3FF',
    selectedText: '#FFFFFF',
  },
} as const;

export type GraphPalette = (typeof palette)[ThemeKey];

/*** Resolves the graph palette for the active light or dark theme. */
export function getGraphPalette(theme: ThemeKey): GraphPalette {
  return theme === 'dark' ? palette.dark : palette.light;
}

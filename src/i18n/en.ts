import type { ILanguage } from '@/i18n/i18n';

const en: ILanguage = {
  // Navigation
  'nav.packages': 'Packages',
  'nav.sequence': 'Sequence',

  // Settings
  'settings.title': 'Settings',
  'settings.showCompoundNodes': 'Show Compound Nodes',
  'settings.showVendorPackages': 'Show Vendor',
  'settings.subPackageDepth': 'Subpackage depth',
  'settings.audit': 'Audit',
  'settings.download': 'Download',
  'settings.layout': 'Layout',
  'settings.layoutSpacing': 'Layout Spacing',
  'settings.filter': 'Filter',
  'settings.rules': 'Rules',
  'settings.cyclicDependencies': 'Cyclic Dependencies',
  'settings.enableCyclicDependencies': 'Enable cyclic dependencies rule',
  'settings.loadingRules': 'Loading findings…',
  'settings.rulesLoadFailed': 'Unable to load findings',
  'settings.noCyclicDependencies': 'No cyclic dependencies',
  'settings.evidence': 'Evidence',
  'settings.selectCycle': 'selection',
  'settings.packages': 'packages',
  'settings.edges': 'edges',
  'settings.closeInspector': 'Close cycle inspector',
  'settings.cyclePath': 'Cycle path',
  'settings.noEvidence': 'No source/import evidence',

  // Layouts
  breadthfirst: 'Breadthfirst',
  circle: 'Circle',
  concentric: 'Concentric',
  elk: 'Elk: Layered',
  grid: 'Grid',
};

export default en;

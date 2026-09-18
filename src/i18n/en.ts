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
  'settings.rulesEnabled': 'Enabled',
  'settings.cyclicDependencies': 'Cyclic Dependencies',
  'settings.loadingRules': 'Loading findings…',
  'settings.noCyclicDependencies': 'No cyclic dependencies',
  'settings.evidence': 'Evidence',

  // Layouts
  breadthfirst: 'Breadthfirst',
  circle: 'Circle',
  concentric: 'Concentric',
  elk: 'Elk: Layered',
  grid: 'Grid',
};

export default en;

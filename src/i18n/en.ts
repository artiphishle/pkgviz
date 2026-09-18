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

  // Audit
  'audit.rules': 'Audit rules',
  'audit.loading': 'Loading audit…',
  'audit.loadError': 'Unable to load audit details.',
  'audit.noRules': 'No audit rules are enabled.',
  'audit.passed': 'Passed',
  'audit.failed': 'Failed',
  'audit.cycle': 'Cycle',
  'audit.noEvidence': 'No source/import evidence available.',
  'audit.imports': 'imports',
  'audit.rule.cyclicDependencies': 'Cyclic dependencies',

  // Layouts
  breadthfirst: 'Breadthfirst',
  circle: 'Circle',
  concentric: 'Concentric',
  elk: 'Elk: Layered',
  grid: 'Grid',
};

export default en;

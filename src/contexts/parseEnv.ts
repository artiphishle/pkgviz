import { toPosix } from '@/utils/toPosix';

/**
 * Parse ENV variable
 * @todo Support more than boolean as soon as needed
 */
export const parseEnv = (name: string, value: string | undefined) => {
  if (!value) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

export const parseProjectPath = () => {
  const projectPath = process.env.NEXT_PUBLIC_PROJECT_PATH;
  if (!projectPath) throw new Error('Missing ENV: NEXT_PUBLIC_PROJECT_PATH');

  return toPosix(projectPath);
};

/**
 * Which Cytoscape layout to use
 * @default concentric
 */
export const getCytoscapeLayout = () => {
  const env = parseEnv('NEXT_PUBLIC_SETTINGS_LAYOUT', process.env.NEXT_PUBLIC_SETTINGS_LAYOUT);
  return env === 'grid'
    ? 'grid'
    : env === 'circle'
      ? 'circle'
      : env === 'elk'
        ? 'elk'
        : 'concentric';
};

/**
 * Which Cytoscape layout spacing to use
 * @default 1
 */
export const getCytoscapeLayoutSpacing = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING',
    process.env.NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING
  );

  return isNaN(Number(env)) ? 1 : Number(env);
};

/**
 * Whether to show vendor packages
 * @default false
 */
export const getShowVendorPackages = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES
  );

  return env === true ? true : false;
};

/**
 * How many subpackage levels to show
 */
export const getSubPackageDepth = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH',
    process.env.NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH
  );

  return typeof env === 'string' && env.length ? parseInt(env) : 1;
};

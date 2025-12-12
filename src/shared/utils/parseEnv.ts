/**
 * Parses an environment variable value into the appropriate type.
 * @example 'true'  => true
 * @example 'false' => false
 * @example '123'   => 123
 * @example 'text'  => 'text'
 */
export const parseEnv = (name: string, value: string | undefined) => {
  if (!value) return undefined;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (!isNaN(Number(value))) return Number(value);
  return value;
};

/**
 * Determines the active Cytoscape layout
 * @default 'concentric'
 * @todo Create enum for the layouts
 * @returns 'grid' | 'circle' | 'elk' | 'concentric'
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
 * Determines the active Cytoscape layout spacing.
 * @returns number
 * @default 1
 * @min 0.1
 * @max 1
 */
export const getCytoscapeLayoutSpacing = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING',
    process.env.NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING
  );

  return isNaN(Number(env)) ? 1 : Number(env);
};

/**
 * Determines whether to show compound nodes.
 * @default true
 * @returns boolean
 */
export const getShowCompoundNodes = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES
  );

  return env === false ? false : true;
};

/**
 * Determines whether to show vendor packages.
 * @default false
 * @returns boolean
 */
export const getShowVendorPackages = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES
  );

  return env === true ? true : false;
};

/**
 * Determines how many subpackage levels to show.
 * @default 1
 * @min 1
 * @max {automatic based on package depth}
 * @returns number
 */
export const getSubPackageDepth = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH',
    process.env.NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH
  );

  return typeof env === 'string' && env.length ? parseInt(env) : 1;
};

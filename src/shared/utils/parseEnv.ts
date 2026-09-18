/***
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

/***
 * Determines the active Cytoscape layout
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

/***
 * Determines the active Cytoscape layout spacing.
 */
export const getCytoscapeLayoutSpacing = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING',
    process.env.NEXT_PUBLIC_SETTINGS_LAYOUT_SPACING
  );

  return isNaN(Number(env)) ? 1 : Number(env);
};

/***
 * Determines whether to show compound nodes.
 */
export const getShowCompoundNodes = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_COMPOUNDNODES
  );

  return env === false ? false : true;
};

/***
 * Determines whether to show vendor packages.
 */
export const getShowVendorPackages = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES',
    process.env.NEXT_PUBLIC_SETTINGS_SHOW_VENDORPACKAGES
  );

  return env === true ? true : false;
};

/***
 * Determines how many subpackage levels to show.
 */
export const getSubPackageDepth = () => {
  const env = parseEnv(
    'NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH',
    process.env.NEXT_PUBLIC_SETTINGS_SUBPACKAGE_DEPTH
  );

  return typeof env === 'string' && env.length ? parseInt(env) : 1;
};

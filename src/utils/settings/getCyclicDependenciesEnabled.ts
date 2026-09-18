/*** Returns the ENV-backed default for cyclic-dependencies visualization. */
export function getCyclicDependenciesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SETTINGS_RULE_CYCLIC_DEPENDENCIES_ENABLED !== 'false';
}

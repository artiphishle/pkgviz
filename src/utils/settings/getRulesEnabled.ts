/*** Returns the ENV-backed default for persisted audit-rule visualization. */
export function getRulesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_SETTINGS_RULES_ENABLED !== 'false';
}

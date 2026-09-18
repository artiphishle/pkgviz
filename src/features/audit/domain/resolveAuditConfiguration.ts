import type {
  AuditConfiguration,
  AuditRuleConfiguration,
  ResolveAuditConfigurationInput,
} from '@/types/audit';

/*** Resolves explicit audit overrides against the stable default rule policy. */
export function resolveAuditConfiguration(
  input: ResolveAuditConfigurationInput = {}
): AuditConfiguration {
  let cyclicDependenciesMode: AuditRuleConfiguration['mode'] = 'block';

  for (const rule of input.rules ?? []) {
    switch (rule.id) {
      case 'cyclic-dependencies':
        cyclicDependenciesMode = rule.mode;
        break;
      default:
        throw new Error(`Unknown audit rule "${rule.id}".`);
    }
  }

  return {
    failOnRuleViolation: input.failOnRuleViolation ?? true,
    rules: [{ id: 'cyclic-dependencies', mode: cyclicDependenciesMode }],
  };
}

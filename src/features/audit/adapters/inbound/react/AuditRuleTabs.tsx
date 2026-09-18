'use client';
import { CheckCircle2Icon, TriangleAlertIcon } from 'lucide-react';
import { Tabs } from 'radix-ui';

import { CyclicDependenciesRuleDetails } from '@/features/audit/adapters/inbound/react/CyclicDependenciesRuleDetails';
import { t } from '@/i18n/i18n';
import type { AuditRuleResult, PackageCycleDetail } from '@/types/audit';

/*** Presents enabled audit rules as accessible status tabs. */
export function AuditRuleTabs({ cyclicPackages, rules }: AuditRuleTabsProps) {
  const [firstRule] = rules;
  if (firstRule === undefined) {
    return <p className="text-xs text-neutral-500 dark:text-neutral-400">{t('audit.noRules')}</p>;
  }

  return (
    <Tabs.Root defaultValue={firstRule.id}>
      <Tabs.List
        aria-label={t('audit.rules')}
        className="flex flex-wrap gap-1 border-b border-neutral-200 pb-2 dark:border-neutral-700"
      >
        {rules.map(rule => (
          <AuditRuleTabTrigger key={rule.id} rule={rule} />
        ))}
      </Tabs.List>

      {rules.map(rule => (
        <Tabs.Content key={rule.id} value={rule.id} className="pt-3 outline-none">
          <AuditRuleTabContent
            cyclicPackages={cyclicPackages}
            rule={rule}
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

/*** Renders one rule tab with its explicit audit status. */
function AuditRuleTabTrigger({ rule }: { readonly rule: AuditRuleResult }) {
  const failed = rule.status === 'failed';
  const StatusIcon = failed ? TriangleAlertIcon : CheckCircle2Icon;

  return (
    <Tabs.Trigger
      value={rule.id}
      className="rounded-md border border-neutral-200 px-2 py-1.5 text-left text-xs data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 dark:border-neutral-700 dark:data-[state=active]:bg-blue-950/40"
    >
      <span className="block font-medium">{formatRuleLabel(rule.id)}</span>
      <span
        className={
          failed
            ? 'mt-1 flex items-center gap-1 text-red-700 dark:text-red-300'
            : 'mt-1 flex items-center gap-1 text-green-700 dark:text-green-300'
        }
      >
        <StatusIcon aria-hidden="true" size={12} />
        {failed ? t('audit.failed') : t('audit.passed')}
      </span>
    </Tabs.Trigger>
  );
}

/*** Routes one audit rule to its dedicated detail renderer. */
function AuditRuleTabContent({
  cyclicPackages,
  rule,
}: {
  readonly cyclicPackages: readonly PackageCycleDetail[];
  readonly rule: AuditRuleResult;
}) {
  if (rule.id === 'cyclic-dependencies') {
    return <CyclicDependenciesRuleDetails cycles={cyclicPackages} rule={rule} />;
  }

  return (
    <div className="space-y-2 text-xs">
      <p>{rule.message}</p>
      {rule.details.map(detail => (
        <p key={detail} className="font-mono text-[11px]">
          {detail}
        </p>
      ))}
    </div>
  );
}

/*** Returns a human-readable label for a stable audit rule ID. */
function formatRuleLabel(ruleId: string): string {
  return ruleId === 'cyclic-dependencies' ? t('audit.rule.cyclicDependencies') : ruleId;
}

interface AuditRuleTabsProps {
  readonly cyclicPackages: readonly PackageCycleDetail[];
  readonly rules: readonly AuditRuleResult[];
}

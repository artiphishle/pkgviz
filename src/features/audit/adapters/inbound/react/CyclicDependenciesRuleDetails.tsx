import { t } from '@/i18n/i18n';
import type {
  AuditRuleResult,
  CycleEdgeEvidence,
  ImportEvidence,
  PackageCycleDetail,
} from '@/types/audit';

/*** Renders cycle paths and their existing source/import evidence. */
export function CyclicDependenciesRuleDetails({
  cycles,
  rule,
}: CyclicDependenciesRuleDetailsProps) {
  if (rule.status === 'passed') {
    return <p className="text-xs text-green-700 dark:text-green-300">{rule.message}</p>;
  }

  return (
    <div className="space-y-3 text-xs">
      <p className="text-red-700 dark:text-red-300">{rule.message}</p>
      <ol className="space-y-3">
        {cycles.map(cycle => (
          <CycleDetail key={cycle.packages.join('→')} cycle={cycle} />
        ))}
      </ol>
    </div>
  );
}

/*** Renders one concrete package cycle. */
function CycleDetail({ cycle }: { readonly cycle: PackageCycleDetail }) {
  return (
    <li className="rounded-md border border-neutral-200 p-2 dark:border-neutral-700">
      <div className="mb-2">
        <span className="font-medium">{t('audit.cycle')}</span>
        <code className="mt-1 block break-all text-[11px]">{cycle.packages.join(' → ')}</code>
      </div>
      <ul className="space-y-2">
        {cycle.edges.map(edge => (
          <CycleEdgeDetail key={`${edge.from}→${edge.to}`} edge={edge} />
        ))}
      </ul>
    </li>
  );
}

/*** Renders one directed cycle edge and all available import evidence. */
function CycleEdgeDetail({ edge }: { readonly edge: CycleEdgeEvidence }) {
  return (
    <li>
      <code className="text-[11px]">{`${edge.from} → ${edge.to}`}</code>
      {edge.via.length === 0 ? (
        <p className="mt-1 text-neutral-500 dark:text-neutral-400">{t('audit.noEvidence')}</p>
      ) : (
        <ul className="mt-1 space-y-1 pl-2">
          {edge.via.map(evidence => (
            <ImportEvidenceDetail
              key={`${evidence.filePath}:${evidence.fileClass}:${evidence.importName}`}
              evidence={evidence}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/*** Renders the source file and import that prove one dependency edge. */
function ImportEvidenceDetail({ evidence }: { readonly evidence: ImportEvidence }) {
  return (
    <li className="break-all text-[11px] text-neutral-600 dark:text-neutral-300">
      <code>{evidence.filePath}</code>
      <span> {t('audit.imports')} </span>
      <code>{evidence.importName}</code>
    </li>
  );
}

interface CyclicDependenciesRuleDetailsProps {
  readonly cycles: readonly PackageCycleDetail[];
  readonly rule: AuditRuleResult;
}

'use client';

import { XIcon } from 'lucide-react';

import type { AuditRuleCycleView } from '@/features/audit/adapters/inbound/react/useAuditRuleControls';
import { t } from '@/i18n/i18n';
import type { CycleEdgeEvidence } from '@/types/audit';

/*** Renders detailed cycle evidence as a non-invasive overlay above the graph. */
export function AuditCycleInspector({ cycle, onClose }: AuditCycleInspectorProps) {
  if (!cycle) return null;

  return (
    <aside className="absolute right-4 top-4 z-20 max-h-[calc(100%-2rem)] w-[min(28rem,calc(100%-2rem))] overflow-auto rounded-lg border border-neutral-200 bg-white/95 shadow-xl backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
      <InspectorHeader cycle={cycle} onClose={onClose} />
      <div className="space-y-4 p-4">
        <InspectorSummary cycle={cycle} />
        <div className="space-y-2">
          {cycle.detail.edges.map((edge, index) => (
            <InspectorEdge key={`${edge.from}->${edge.to}-${index}`} edge={edge} step={index + 1} />
          ))}
        </div>
      </div>
    </aside>
  );
}

/*** Renders cycle identity, stable color, and the inspector close action. */
function InspectorHeader({ cycle, onClose }: AuditCycleInspectorProps) {
  if (!cycle) return null;

  return (
    <header className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
      <span
        aria-hidden="true"
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: cycle.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{cycle.label}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {cycle.packageCount} {t('settings.packages')} · {cycle.detail.edges.length}{' '}
          {t('settings.edges')}
        </div>
      </div>
      <button
        type="button"
        aria-label={t('settings.closeInspector')}
        onClick={onClose}
        className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
      >
        <XIcon size={16} />
      </button>
    </header>
  );
}

/*** Renders the complete directed cycle path. */
function InspectorSummary({ cycle }: { readonly cycle: AuditRuleCycleView }) {
  return (
    <section>
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {t('settings.cyclePath')}
      </div>
      <div className="break-words text-sm leading-6">{cycle.path}</div>
    </section>
  );
}

/*** Renders one directed dependency edge and its collapsible import evidence. */
function InspectorEdge({ edge, step }: InspectorEdgeProps) {
  return (
    <details className="rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950">
      <summary className="cursor-pointer list-none px-3 py-2">
        <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-semibold dark:bg-neutral-700">
          {step}
        </span>
        <span className="text-xs font-medium">
          {edge.from} → {edge.to}
        </span>
      </summary>
      <EvidenceList edge={edge} />
    </details>
  );
}

/*** Renders existing source/import evidence for one cycle edge. */
function EvidenceList({ edge }: { readonly edge: CycleEdgeEvidence }) {
  if (edge.via.length === 0) {
    return (
      <div className="border-t border-neutral-200 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        {t('settings.noEvidence')}
      </div>
    );
  }

  return (
    <div className="space-y-2 border-t border-neutral-200 px-3 py-2 dark:border-neutral-700">
      {edge.via.map((item, index) => (
        <div key={`${item.filePath}-${item.importName}-${index}`} className="text-xs">
          <div className="break-words font-medium">{item.filePath}</div>
          <div className="break-words text-neutral-500 dark:text-neutral-400">
            {item.importName}
          </div>
        </div>
      ))}
    </div>
  );
}

interface AuditCycleInspectorProps {
  readonly cycle: AuditRuleCycleView | null;
  readonly onClose: () => void;
}

interface InspectorEdgeProps {
  readonly edge: CycleEdgeEvidence;
  readonly step: number;
}

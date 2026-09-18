'use client';
import { XIcon } from 'lucide-react';
import React from 'react';

import { t } from '@/i18n/i18n';
import type { CycleEdgeEvidence } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';

/*** Renders detailed cycle evidence outside the constrained settings sidebar. */
export function CycleInspector({ inspection, onClose }: CycleInspectorProps) {
  return (
    <aside className="absolute top-4 right-4 z-20 w-[24rem] max-w-[calc(100%-2rem)] rounded-lg border border-neutral-200 bg-white/95 shadow-xl backdrop-blur dark:border-neutral-700 dark:bg-neutral-950/95">
      <InspectorHeader inspection={inspection} onClose={onClose} />
      <div className="max-h-[60vh] overflow-y-auto p-4">
        <section>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {t('audit.cyclePath')}
          </h4>
          <code className="mt-2 block break-words text-xs leading-5">
            {inspection.cycle.packages.join(' → ')}
          </code>
        </section>
        <CycleEvidence edges={inspection.cycle.edges} />
      </div>
    </aside>
  );
}

/*** Renders cycle identity and summary metadata. */
function InspectorHeader({ inspection, onClose }: CycleInspectorProps) {
  const packageCount = new Set(inspection.cycle.packages).size;

  return (
    <header className="flex items-start gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
      <span
        aria-hidden="true"
        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: inspection.color }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">{inspection.label}</h3>
        <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
          {packageCount} {t('audit.packages')} · {inspection.cycle.edges.length}{' '}
          {t('audit.dependencyEdges')}
        </p>
      </div>
      <button
        type="button"
        aria-label={t('audit.closeInspector')}
        onClick={onClose}
        className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      >
        <XIcon size={16} />
      </button>
    </header>
  );
}

/*** Renders collapsible evidence for every directed edge in the cycle. */
function CycleEvidence({ edges }: { readonly edges: readonly CycleEdgeEvidence[] }) {
  return (
    <section className="mt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {t('audit.dependencyEvidence')}
      </h4>
      <div className="mt-2 space-y-2">
        {edges.map((edge, index) => (
          <EvidenceEdge edge={edge} index={index} key={edge.from + '→' + edge.to + ':' + index} />
        ))}
      </div>
    </section>
  );
}

/*** Renders one directed dependency edge and its source/import evidence. */
function EvidenceEdge({ edge, index }: EvidenceEdgeProps) {
  return (
    <details className="rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs dark:border-neutral-800 dark:bg-neutral-900">
      <summary className="cursor-pointer font-medium">
        {index + 1}. {edge.from} → {edge.to}
      </summary>
      <div className="mt-2 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
        {edge.via.length === 0
          ? t('audit.noEvidence')
          : edge.via.map((evidence, evidenceIndex) => (
              <div
                key={
                  evidence.filePath +
                  ':' +
                  evidence.fileClass +
                  ':' +
                  evidence.importName +
                  ':' +
                  evidenceIndex
                }
                className="break-all"
              >
                <code>{evidence.filePath}</code>
                <span> {t('audit.imports')} </span>
                <code>{evidence.importName}</code>
              </div>
            ))}
      </div>
    </details>
  );
}

interface CycleInspectorProps {
  readonly inspection: CycleInspection;
  readonly onClose: () => void;
}

interface EvidenceEdgeProps {
  readonly edge: CycleEdgeEvidence;
  readonly index: number;
}

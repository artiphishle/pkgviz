'use client';
import { IconButton } from '@zora/button';
import { Card } from '@zora/card';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import React from 'react';

import { t } from '@/i18n/i18n';
import type { CycleEdgeEvidence } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';
import type { ZoraMode } from '@/types/zora';

/*** Renders detailed cycle evidence in a ZORA card outside the constrained settings sidebar. */
export function CycleInspector({ inspection, mode, onClose }: CycleInspectorProps) {
  const packageCount = new Set(inspection.cycle.packages).size;

  return (
    <aside className="absolute top-4 right-4 z-20 w-[24rem] max-w-[calc(100%-2rem)]">
      <Card
        compact
        actions={
          <IconButton
            color="neutral"
            icon={{ name: 'close-outline' }}
            label={t('audit.closeInspector')}
            mode={mode}
            size="s"
            variant="ghost"
            onPress={onClose}
          />
        }
        description={`${packageCount} ${t('audit.packages')} · ${inspection.cycle.edges.length} ${t(
          'audit.dependencyEdges'
        )}`}
        mode={mode}
        title={inspection.label}
        tone="outline"
      >
        <View mode={mode} gap="m">
          <View mode={mode} align="center" direction="row" gap="s">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: inspection.color }}
            />
            <Text mode={mode} variant="label" weight="bold">
              {t('audit.cyclePath')}
            </Text>
          </View>
          <Text mode={mode} selectable variant="code">
            {inspection.cycle.packages.join(' → ')}
          </Text>
          <CycleEvidence edges={inspection.cycle.edges} mode={mode} />
        </View>
      </Card>
    </aside>
  );
}

/*** Renders collapsible evidence for every directed edge in the cycle. */
function CycleEvidence({ edges, mode }: CycleEvidenceProps) {
  return (
    <View mode={mode} gap="s">
      <Text mode={mode} variant="label" weight="bold">
        {t('audit.dependencyEvidence')}
      </Text>
      {edges.map((edge, index) => (
        <EvidenceEdge
          edge={edge}
          index={index}
          key={edge.from + '→' + edge.to + ':' + index}
          mode={mode}
        />
      ))}
    </View>
  );
}

/*** Renders one directed dependency edge and its source/import evidence. */
function EvidenceEdge({ edge, index, mode }: EvidenceEdgeProps) {
  return (
    <details className="rounded border border-neutral-200 px-3 py-2 text-xs dark:border-neutral-800">
      <summary className="cursor-pointer font-medium">
        {index + 1}. {edge.from} → {edge.to}
      </summary>
      <View mode={mode} gap="xs" pt="s">
        {edge.via.length === 0 ? (
          <Text mode={mode} emphasis="muted" variant="caption">
            {t('audit.noEvidence')}
          </Text>
        ) : (
          edge.via.map((evidence, evidenceIndex) => (
            <Text
              key={
                evidence.filePath +
                ':' +
                evidence.fileClass +
                ':' +
                evidence.importName +
                ':' +
                evidenceIndex
              }
              mode={mode}
              selectable
              variant="code"
            >
              {evidence.filePath} {t('audit.imports')} {evidence.importName}
            </Text>
          ))
        )}
      </View>
    </details>
  );
}

interface CycleInspectorProps {
  readonly inspection: CycleInspection;
  readonly mode: ZoraMode;
  readonly onClose: () => void;
}

interface CycleEvidenceProps {
  readonly edges: readonly CycleEdgeEvidence[];
  readonly mode: ZoraMode;
}

interface EvidenceEdgeProps {
  readonly edge: CycleEdgeEvidence;
  readonly index: number;
  readonly mode: ZoraMode;
}

'use client';
import { IconButton } from '@zora/button';
import { Card } from '@zora/card';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import React from 'react';

import { t } from '@/i18n/i18n';
import type { CycleEdgeEvidence } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';

/*** Renders detailed cycle evidence in a ZORA card outside the constrained settings sidebar. */
export function CycleInspector({ inspection, onClose }: CycleInspectorProps) {
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
            size="s"
            variant="ghost"
            onPress={onClose}
          />
        }
        description={`${packageCount} ${t('audit.packages')} · ${inspection.cycle.edges.length} ${t(
          'audit.dependencyEdges'
        )}`}
        title={inspection.label}
        tone="outline"
      >
        <View gap="m">
          <View align="center" direction="row" gap="s">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: inspection.color }}
            />
            <Text variant="label" weight="bold">
              {t('audit.cyclePath')}
            </Text>
          </View>
          <Text selectable variant="code">
            {inspection.cycle.packages.join(' → ')}
          </Text>
          <CycleEvidence edges={inspection.cycle.edges} />
        </View>
      </Card>
    </aside>
  );
}

/*** Renders collapsible evidence for every directed edge in the cycle. */
function CycleEvidence({ edges }: CycleEvidenceProps) {
  return (
    <View gap="s">
      <Text variant="label" weight="bold">
        {t('audit.dependencyEvidence')}
      </Text>
      {edges.map((edge, index) => (
        <EvidenceEdge edge={edge} index={index} key={edge.from + '→' + edge.to + ':' + index} />
      ))}
    </View>
  );
}

/*** Renders one directed dependency edge and its source/import evidence. */
function EvidenceEdge({ edge, index }: EvidenceEdgeProps) {
  return (
    <details className="rounded border border-neutral-200 px-3 py-2 text-xs dark:border-neutral-800">
      <summary className="cursor-pointer font-medium">
        {index + 1}. {edge.from} → {edge.to}
      </summary>
      <View gap="xs" pt="s">
        {edge.via.length === 0 ? (
          <Text emphasis="muted" variant="caption">
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
  readonly onClose: () => void;
}

interface CycleEvidenceProps {
  readonly edges: readonly CycleEdgeEvidence[];
}

interface EvidenceEdgeProps {
  readonly edge: CycleEdgeEvidence;
  readonly index: number;
}

'use client';
import { Accordion, AccordionItem } from '@zora/accordion';
import { IconButton } from '@zora/button';
import { Card } from '@zora/card';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import { useZoraTheme } from '@zora/ZoraProvider';
import React from 'react';

import { t } from '@/i18n/i18n';
import type { CycleEdgeEvidence } from '@/types/audit';
import type { CycleInspection } from '@/types/auditVisualization';

const INSPECTOR_STYLE = {
  maxWidth: 'calc(100% - 2rem)',
  position: 'absolute',
  right: 16,
  top: 16,
  width: 384,
  zIndex: 20,
} as const;

/*** Renders detailed cycle evidence in a ZORA card outside the constrained settings sidebar. */
export function CycleInspector({ inspection, onClose }: CycleInspectorProps) {
  const { theme } = useZoraTheme();

  return (
<<<<<<< HEAD
    <aside style={INSPECTOR_STYLE}>
      <CycleInspectorCard
        inspection={inspection}
        borderColor={theme.semantics.border.subtle}
        onClose={onClose}
      />
=======
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
          <Text variant="label" weight="bold">
            {t('audit.cyclePath')}
          </Text>
          <Text selectable variant="code">
            {inspection.cycle.packages.join(' → ')}
          </Text>
          <CycleEvidence edges={inspection.cycle.edges} />
        </View>
      </Card>
>>>>>>> origin/main
    </aside>
  );
}

<<<<<<< HEAD
/*** Renders the themed card body for one inspected dependency cycle. */
function CycleInspectorCard({ borderColor, inspection, onClose }: CycleInspectorCardProps) {
  const packageCount = new Set(inspection.cycle.packages).size;

  return (
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
            style={{
              backgroundColor: inspection.color,
              borderRadius: 999,
              flexShrink: 0,
              height: 10,
              width: 10,
            }}
          />
          <Text variant="label" weight="bold">
            {t('audit.cyclePath')}
          </Text>
        </View>
        <Text selectable variant="code">
          {inspection.cycle.packages.join(' → ')}
        </Text>
        <CycleEvidence edges={inspection.cycle.edges} borderColor={borderColor} />
      </View>
    </Card>
  );
}

/*** Renders collapsible evidence for every directed edge in the cycle. */
function CycleEvidence({ borderColor, edges }: CycleEvidenceProps) {
=======
/*** Renders dependency evidence with canonical ZORA disclosure semantics. */
function CycleEvidence({ edges }: CycleEvidenceProps) {
>>>>>>> origin/main
  return (
    <View gap="s">
      <Text variant="label" weight="bold">
        {t('audit.dependencyEvidence')}
      </Text>
<<<<<<< HEAD
      {edges.map((edge, index) => (
        <EvidenceEdge
          borderColor={borderColor}
          edge={edge}
          index={index}
          key={edge.from + '→' + edge.to + ':' + index}
        />
      ))}
=======
      <Accordion type="multiple">
        {edges.map((edge, index) => (
          <EvidenceEdge edge={edge} index={index} key={edge.from + '→' + edge.to + ':' + index} />
        ))}
      </Accordion>
>>>>>>> origin/main
    </View>
  );
}

/*** Renders one directed dependency edge and its source/import evidence. */
function EvidenceEdge({ borderColor, edge, index }: EvidenceEdgeProps) {
  return (
<<<<<<< HEAD
    <details
      style={{
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        fontSize: 12,
        padding: '8px 12px',
      }}
    >
      <summary style={{ cursor: 'pointer', fontWeight: 500 }}>
        {index + 1}. {edge.from} → {edge.to}
      </summary>
      <View gap="xs" pt="s">
=======
    <AccordionItem
      title={`${index + 1}. ${edge.from} → ${edge.to}`}
      value={`edge-${index}-${edge.from}-${edge.to}`}
    >
      <View gap="xs">
>>>>>>> origin/main
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
    </AccordionItem>
  );
}

interface CycleInspectorProps {
  readonly inspection: CycleInspection;
  readonly onClose: () => void;
}

interface CycleInspectorCardProps extends CycleInspectorProps {
  readonly borderColor: string;
}

interface CycleEvidenceProps {
  readonly borderColor: string;
  readonly edges: readonly CycleEdgeEvidence[];
}

interface EvidenceEdgeProps {
  readonly borderColor: string;
  readonly edge: CycleEdgeEvidence;
  readonly index: number;
}

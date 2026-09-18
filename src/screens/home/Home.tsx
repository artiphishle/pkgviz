'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useState } from 'react';

import { getAuditEvaluationAction } from '@/app/actions/audit.actions';
import { getGraphAction } from '@/app/actions/graph.actions';
import Breadcrumb from '@/components/Breadcrumb';
import { Cytoscape } from '@/components/Cytoscape';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import type { CycleHighlight } from '@/types/auditVisualization';

/*** Renders the PKGViz home screen with rules embedded below persistent graph settings. */
export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [cycleHighlights, setCycleHighlights] = useState<readonly CycleHighlight[]>([]);

  useEffect(() => {
    if (!packageGraph) {
      getGraphAction().then(setPackageGraph);
    }
  }, [packageGraph]);

  return (
    <>
      <Header title="nav.packages">
        <Breadcrumb
          path={currentPackage.replace(/\./g, '/')}
          onNavigate={(path: string) => setCurrentPackage(path.replace(/\//g, '.'))}
        />
      </Header>

      <SettingsProvider>
        <main data-testid="main" className="flex min-w-0 flex-1 flex-row dark:bg-[#171717]">
          <Sidebar>
            <SettingsPanel
              onRulesDisabled={() => setCycleHighlights([])}
              rules={
                <AuditRulePanel
                  loadAudit={getAuditEvaluationAction}
                  onCycleHighlightsChange={setCycleHighlights}
                />
              }
            />
          </Sidebar>
          {packageGraph ? (
            <Cytoscape
              currentPackage={currentPackage}
              setCurrentPackage={setCurrentPackage}
              packageGraph={packageGraph}
              cycleHighlights={cycleHighlights}
            />
          ) : (
            <Loader />
          )}
        </main>
      </SettingsProvider>
    </>
  );
}

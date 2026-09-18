'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useState } from 'react';

import { getAuditEvaluationAction } from '@/app/actions/audit.actions';
import { getGraphAction } from '@/app/actions/graph.actions';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { HomeGraph } from '@/screens/home/HomeGraph';
import { HomeSidebar } from '@/screens/home/HomeSidebar';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders the PKGViz home screen and composes sidebar diagnostics with the graph. */
export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [auditEvaluation, setAuditEvaluation] = useState<Audit['evaluation'] | null>(null);
  const [cycleHighlights, setCycleHighlights] = useState<readonly CycleHighlight[]>([]);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);

  useEffect(() => {
    void getGraphAction().then(setPackageGraph);
    void getAuditEvaluationAction().then(setAuditEvaluation);
  }, []);

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
          <HomeSidebar
            evaluation={auditEvaluation}
            onCycleHighlightsChange={setCycleHighlights}
            onCycleInspectionChange={setCycleInspection}
          />
          <HomeGraph
            currentPackage={currentPackage}
            cycleHighlights={cycleHighlights}
            cycleInspection={cycleInspection}
            packageGraph={packageGraph}
            setCurrentPackage={setCurrentPackage}
            onCloseInspection={() => setCycleInspection(null)}
          />
        </main>
      </SettingsProvider>
    </>
  );
}

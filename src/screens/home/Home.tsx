'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useState } from 'react';

import { getAuditEvaluationAction } from '@/app/actions/audit.actions';
import { getGraphAction } from '@/app/actions/graph.actions';
import Breadcrumb from '@/components/Breadcrumb';
import { Cytoscape } from '@/components/Cytoscape';
import { ExportPanel } from '@/components/ExportPanel';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { SidebarTabs } from '@/components/sidebar/SidebarTabs';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { AuditRulePanel } from '@/features/audit/adapters/inbound/react/AuditRulePanel';
import { CycleInspector } from '@/features/audit/adapters/inbound/react/CycleInspector';
import { t } from '@/i18n/i18n';
import type { Audit } from '@/types/audit';
import type { CycleHighlight, CycleInspection } from '@/types/auditVisualization';

/*** Renders graph controls permanently while secondary Rules and Export views stay above them. */
export default function HomeScreen() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const [auditEvaluation, setAuditEvaluation] = useState<Audit['evaluation'] | null>(null);
  const [activeSidebarTool, setActiveSidebarTool] = useState<string | null>(null);
  const [cycleHighlights, setCycleHighlights] = useState<readonly CycleHighlight[]>([]);
  const [cycleInspection, setCycleInspection] = useState<CycleInspection | null>(null);

  useEffect(() => {
    void getGraphAction().then(setPackageGraph);
    void getAuditEvaluationAction().then(setAuditEvaluation);
  }, []);

  const violatedRuleCount =
    auditEvaluation?.rules.filter(rule => rule.status === 'failed').length ?? 0;

  /*** Switches secondary sidebar tools and exits diagnostics cleanly when leaving Rules. */
  const selectSidebarTool = (value: string) => {
    if (activeSidebarTool === 'rules' && value !== 'rules') {
      setCycleHighlights([]);
      setCycleInspection(null);
    }
    setActiveSidebarTool(value);
  };

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
            <SidebarTabs
              ariaLabel={t('sidebar.tools')}
              value={activeSidebarTool}
              onValueChange={selectSidebarTool}
              tabs={[
                {
                  id: 'rules',
                  label: t('settings.rules'),
                  badge: violatedRuleCount,
                  badgeTone: 'danger',
                  disabled: violatedRuleCount === 0,
                  content:
                    auditEvaluation === null ? null : (
                      <AuditRulePanel
                        evaluation={auditEvaluation}
                        onCycleHighlightsChange={setCycleHighlights}
                        onCycleInspectionChange={setCycleInspection}
                      />
                    ),
                },
                {
                  id: 'export',
                  label: t('settings.export'),
                  content: <ExportPanel />,
                },
              ]}
            />
            <SettingsPanel />
          </Sidebar>

          {packageGraph ? (
            <Cytoscape
              currentPackage={currentPackage}
              setCurrentPackage={setCurrentPackage}
              packageGraph={packageGraph}
              cycleHighlights={cycleHighlights}
              overlay={
                cycleInspection === null ? null : (
                  <CycleInspector
                    inspection={cycleInspection}
                    onClose={() => setCycleInspection(null)}
                  />
                )
              }
            />
          ) : (
            <Loader />
          )}
        </main>
      </SettingsProvider>
    </>
  );
}

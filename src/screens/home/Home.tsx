'use client';
import type { ElementsDefinition } from 'cytoscape';
import { useEffect, useState } from 'react';

import { getGraphAction } from '@/app/actions/graph.actions';
import Breadcrumb from '@/components/Breadcrumb';
import { Cytoscape } from '@/components/Cytoscape';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import Settings from '@/components/Settings';
import { SettingsProvider, useSettings } from '@/contexts/SettingsContext';
import { AuditCycleInspector } from '@/features/audit/adapters/inbound/react/AuditCycleInspector';
import { AuditRulesSettings } from '@/features/audit/adapters/inbound/react/AuditRulesSettings';
import { useAuditRuleControls } from '@/features/audit/adapters/inbound/react/useAuditRuleControls';

/*** Renders the PKGViz home screen within persisted settings state. */
export default function HomeScreen() {
  return (
    <SettingsProvider>
      <HomeContent />
    </SettingsProvider>
  );
}

/*** Composes graph settings, audit-rule controls, and graph visualization at the screen boundary. */
function HomeContent() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const { cyclicDependenciesEnabled, toggleCyclicDependenciesEnabled } = useSettings();
  const auditRuleControls = useAuditRuleControls(cyclicDependenciesEnabled);

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

      <main data-testid="main" className="flex flex-1 flex-row dark:bg-[#171717]">
        <Settings>
          <AuditRulesSettings
            controls={auditRuleControls}
            enabled={cyclicDependenciesEnabled}
            onToggleEnabled={() => {
              auditRuleControls.clearActiveCycles();
              toggleCyclicDependenciesEnabled();
            }}
          />
        </Settings>

        <div className="relative flex min-w-0 flex-1">
          {packageGraph ? (
            <Cytoscape
              currentPackage={currentPackage}
              setCurrentPackage={setCurrentPackage}
              packageGraph={packageGraph}
              cycleHighlights={auditRuleControls.highlights}
            />
          ) : (
            <Loader />
          )}
          <AuditCycleInspector
            cycle={auditRuleControls.inspectedCycle}
            onClose={auditRuleControls.closeInspector}
          />
        </div>
      </main>
    </>
  );
}

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
import {
  type AuditRuleControlState,
  useAuditRuleControls,
} from '@/features/audit/adapters/inbound/react/useAuditRuleControls';

/*** Renders the PKGViz home screen within persisted settings state. */
export default function HomeScreen() {
  return (
    <SettingsProvider>
      <HomeContent />
    </SettingsProvider>
  );
}

/*** Composes settings, audit controls, and the graph workspace at the screen boundary. */
function HomeContent() {
  const [currentPackage, setCurrentPackage] = useState<string>('');
  const [packageGraph, setPackageGraph] = useState<ElementsDefinition | null>(null);
  const { cyclicDependenciesEnabled, toggleCyclicDependenciesEnabled } = useSettings();
  const auditRuleControls = useAuditRuleControls(cyclicDependenciesEnabled);

  useEffect(() => {
    if (!packageGraph) getGraphAction().then(setPackageGraph);
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
        <GraphWorkspace
          auditRuleControls={auditRuleControls}
          currentPackage={currentPackage}
          packageGraph={packageGraph}
          setCurrentPackage={setCurrentPackage}
        />
      </main>
    </>
  );
}

/*** Renders the dependency graph and optional audit inspector without affecting viewport state. */
function GraphWorkspace({
  auditRuleControls,
  currentPackage,
  packageGraph,
  setCurrentPackage,
}: GraphWorkspaceProps) {
  return (
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
  );
}

interface GraphWorkspaceProps {
  readonly auditRuleControls: AuditRuleControlState;
  readonly currentPackage: string;
  readonly packageGraph: ElementsDefinition | null;
  readonly setCurrentPackage: (path: string) => void;
}

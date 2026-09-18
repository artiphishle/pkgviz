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
  const { rulesEnabled, toggleRulesEnabled } = useSettings();
  const auditRuleControls = useAuditRuleControls(rulesEnabled);

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
            enabled={rulesEnabled}
            onToggleEnabled={() => {
              auditRuleControls.clearSelection();
              toggleRulesEnabled();
            }}
          />
        </Settings>

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
      </main>
    </>
  );
}

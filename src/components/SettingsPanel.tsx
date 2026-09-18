'use client';
import { ChevronDownIcon, DownloadIcon } from 'lucide-react';
import React from 'react';
import { Select, Slider } from 'radix-ui';

import { downloadAuditJsonAction, downloadAuditXmlAction } from '@/app/actions/audit.actions';
import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/i18n/i18n';

/*** Renders graph settings using the shared application-sidebar primitives. */
export function SettingsPanel() {
  const {
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    maxSubPackageDepth,
    showCompoundNodes,
    showVendorPackages,
    subPackageDepth,
    setCytoscapeLayout,
    setCytoscapeLayoutSpacing,
    setSubPackageDepth,
    toggleShowCompoundNodes,
    toggleShowVendorPackages,
  } = useSettings();

  return (
    <>
      <DownloadSettings />
      <SidebarSection title={t('settings.filter')}>
        <SidebarRow>
          <Switch
            id="switch-show-vendor-packages"
            label={t('settings.showVendorPackages')}
            onToggle={toggleShowVendorPackages}
            value={showVendorPackages}
          />
        </SidebarRow>
        <SidebarRow>
          <Switch
            id="switch-show-compound-nodes"
            label={t('settings.showCompoundNodes')}
            onToggle={toggleShowCompoundNodes}
            value={showCompoundNodes}
          />
        </SidebarRow>
      </SidebarSection>
      <SidebarSection title={`${t('settings.subPackageDepth')}: ${subPackageDepth}`}>
        <SidebarRow>
          <Slider.Root
            id="subPackageDepth"
            min={1}
            max={maxSubPackageDepth}
            step={1}
            value={[subPackageDepth]}
            onValueChange={([value]) => setSubPackageDepth(Number(value.toFixed(1)))}
            aria-label={t('settings.subPackageDepth')}
            className="relative flex h-5 w-full touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
          </Slider.Root>
        </SidebarRow>
      </SidebarSection>
      <SidebarSection title={t('settings.layout')}>
        <SidebarRow>
          <Select.Root value={cytoscapeLayout} onValueChange={setCytoscapeLayout}>
            <Select.Trigger
              aria-label={t('cytoscapeLayout')}
              className="inline-flex h-9 w-full items-center justify-between rounded-md border px-3"
            >
              <Select.Value className="text-foreground" />
              <Select.Icon>
                <ChevronDownIcon size={16} />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                side="bottom"
                align="start"
                sideOffset={6}
                className="z-50 min-w-(--radix-select-trigger-width) rounded-md border bg-white shadow-md dark:bg-neutral-900"
              >
                <Select.Viewport className="p-1">
                  <Select.Group>
                    {['breadthfirst', 'circle', 'concentric', 'elk', 'grid'].map(layout => (
                      <Select.Item
                        key={layout}
                        value={layout}
                        textValue={t(layout)}
                        className="rounded px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        <Select.ItemText>{t(layout)}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </SidebarRow>
      </SidebarSection>
      <SidebarSection title={`${t('settings.layoutSpacing')}: ${cytoscapeLayoutSpacing}`}>
        <SidebarRow>
          <Slider.Root
            id="spacing"
            min={0.1}
            max={1}
            step={0.1}
            value={[cytoscapeLayoutSpacing]}
            onValueChange={([value]) => setCytoscapeLayoutSpacing(Number(value.toFixed(1)))}
            aria-label={t('settings.layoutSpacing')}
            className="relative flex h-5 w-full touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
          </Slider.Root>
        </SidebarRow>
      </SidebarSection>
    </>
  );
}

/*** Renders audit-download settings using the shared sidebar category styling. */
function DownloadSettings() {
  return (
    <SidebarSection title={t('settings.download')}>
      <SidebarRow>
        <DownloadButton format="JSON" onDownload={downloadAuditJsonAction} mimeType="application/json" />
      </SidebarRow>
      <SidebarRow>
        <DownloadButton format="XML" onDownload={downloadAuditXmlAction} mimeType="application/xml" />
      </SidebarRow>
    </SidebarSection>
  );
}

/*** Downloads one serialized audit format from its server action. */
function DownloadButton({ format, mimeType, onDownload }: DownloadButtonProps) {
  return (
    <button
      onClick={async () => {
        const { data, filename } = await onDownload();
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }}
      className="flex cursor-pointer items-center text-xs hover:text-blue-600 dark:hover:text-blue-400"
    >
      <DownloadIcon size={10} className="mr-1.5" />
      <span>{format}</span>
    </button>
  );
}

interface DownloadButtonProps {
  readonly format: string;
  readonly mimeType: string;
  readonly onDownload: () => Promise<{ data: string; filename: string }>;
}

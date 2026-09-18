'use client';
import { ChevronDownIcon, DownloadIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Select, Slider } from 'radix-ui';
import type { ReactNode } from 'react';

import { downloadAuditJsonAction, downloadAuditXmlAction } from '@/app/actions/audit.actions';
import Setting from '@/components/Setting';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/i18n/i18n';

/*** Renders the graph settings panel and any screen-composed trailing settings categories. */
const Settings = ({ children }: SettingsProps) => {
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

  /*** Downloads the current audit as JSON. */
  const handleDownloadJson = async () => {
    const { data, filename } = await downloadAuditJsonAction();
    downloadBlob(data, filename, 'application/json');
  };

  /*** Downloads the current audit as XML. */
  const handleDownloadXml = async () => {
    const { data, filename } = await downloadAuditXmlAction();
    downloadBlob(data, filename, 'application/xml');
  };

  return (
    <div className="w-72 min-w-72 max-w-72 shrink-0 overflow-x-hidden overflow-y-auto border-r border-r-neutral-200 bg-neutral-100 md:pt-14 dark:border-r-neutral-800 dark:bg-neutral-950">
      <SidebarSection title={t('settings.download')}>
        <Setting>
          <button
            onClick={handleDownloadJson}
            className="flex cursor-pointer flex-row items-center content-start text-xs hover:text-blue-600 dark:hover:text-blue-400"
          >
            <DownloadIcon size={8} className="mr-1" />
            <span>JSON</span>
          </button>
        </Setting>
        <Setting>
          <button
            onClick={handleDownloadXml}
            className="flex cursor-pointer flex-row items-center content-start text-xs hover:text-blue-600 dark:hover:text-blue-400"
          >
            <DownloadIcon size={8} className="mr-1" />
            <span>XML</span>
          </button>
        </Setting>
      </SidebarSection>

      <SidebarSection title={t('settings.filter')}>
        <Setting>
          <Switch
            id="switch-show-vendor-packages"
            label={t('settings.showVendorPackages')}
            onToggle={toggleShowVendorPackages}
            value={showVendorPackages}
          />
        </Setting>
        <Setting>
          <Switch
            id="switch-show-compound-nodes"
            label={t('settings.showCompoundNodes')}
            onToggle={toggleShowCompoundNodes}
            value={showCompoundNodes}
          />
        </Setting>
      </SidebarSection>

      <SidebarSection title={`${t('settings.subPackageDepth')}: ${subPackageDepth}`}>
        <Setting>
          <Slider.Root
            id="subPackageDepth"
            min={1}
            max={maxSubPackageDepth}
            step={1}
            value={[subPackageDepth]}
            onValueChange={([value]) => setSubPackageDepth(Number(value.toFixed(1)))}
            aria-label="Subpackage depth"
            className="relative flex h-5 w-56 touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
          </Slider.Root>
        </Setting>
      </SidebarSection>

      <SidebarSection title={t('settings.layout')}>
        <Setting>
          <Select.Root value={cytoscapeLayout} onValueChange={setCytoscapeLayout}>
            <Select.Trigger
              aria-label={t('cytoscapeLayout')}
              className="inline-flex h-9 w-44 items-center justify-between rounded-md border px-3"
            >
              <Select.Value className="text-foreground" />
              <Select.Icon>
                <ChevronDownIcon />
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
        </Setting>
      </SidebarSection>

      <SidebarSection title={`${t('settings.layoutSpacing')}: ${cytoscapeLayoutSpacing}`}>
        <Setting>
          <Slider.Root
            id="spacing"
            min={0.1}
            max={1}
            step={0.1}
            value={[cytoscapeLayoutSpacing]}
            onValueChange={([value]) => setCytoscapeLayoutSpacing(Number(value.toFixed(1)))}
            aria-label="Layout spacing"
            className="relative flex h-5 w-56 touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
          </Slider.Root>
        </Setting>
      </SidebarSection>

      {children}
    </div>
  );
};

/*** Triggers a browser download for serialized audit content. */
function downloadBlob(data: string, filename: string, type: string) {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default dynamic(() => Promise.resolve(Settings), {
  ssr: false,
});

interface SettingsProps {
  readonly children?: ReactNode;
}

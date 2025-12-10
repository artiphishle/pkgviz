'use client';
import dynamic from 'next/dynamic';
import { ChevronDownIcon, DownloadIcon } from 'lucide-react';
import { Select, Slider } from 'radix-ui';
import React from 'react';
import Setting from '@/components/Setting';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/i18n/i18n';

const Settings: React.FC = () => {
  const {
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    maxSubPackageDepth,
    showVendorPackages,
    subPackageDepth,
    setCytoscapeLayout,
    setCytoscapeLayoutSpacing,
    setSubPackageDepth,
    toggleShowVendorPackages,
  } = useSettings();

  return (
    <div className="md:pt-14 border-r bg-neutral-100 border-r-neutral-200 dark:border-r-neutral-800 dark:bg-neutral-950">
      {/* Audit Download */}
      <h3>{t('settings.download')}</h3>
      <div>
        {/* JSON Audit Download */}
        <Setting>
          <a
            className="flex flex-row items-center content-start text-xs"
            href="/api/audit/json"
            download
          >
            <DownloadIcon size={8} className="mr-1" />
            <span>JSON</span>
          </a>
        </Setting>
        {/* XML Audit Download */}
        <Setting>
          <a
            className="flex flex-row items-center content-start text-xs"
            href="/api/audit/xml"
            download
          >
            <DownloadIcon size={8} className="mr-1" />
            <span>XML</span>
          </a>
        </Setting>
      </div>

      <h3>{t('settings.filter')}</h3>
      {/* Whether to show vendor packages */}
      <Setting>
        <Switch
          id="switch-show-vendor-packages"
          label={t('settings.showVendorPackages')}
          onToggle={() => {
            toggleShowVendorPackages();
          }}
          value={showVendorPackages}
        />
      </Setting>

      {/* How many sub package levels to show */}
      <>
        <h3>{`${t('settings.subPackageDepth')}: ${subPackageDepth}`}</h3>
        <Setting>
          <Slider.Root
            id="subPackageDepth"
            min={1}
            max={maxSubPackageDepth}
            step={1}
            value={[subPackageDepth]}
            onValueChange={([v]) => setSubPackageDepth(Number(v.toFixed(1)))}
            aria-label="Subpackage depth"
            className="relative flex h-5 w-56 touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
              <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
            </Slider.Track>
            <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
          </Slider.Root>
        </Setting>
      </>

      <h3>{t('settings.layout')}</h3>
      {/* Which Cytoscape layout style */}
      <Setting>
        <Select.Root value={cytoscapeLayout} onValueChange={setCytoscapeLayout}>
          <Select.Trigger
            aria-label={t('cytoscapeLayout')}
            className="inline-flex items-center justify-between w-44 h-9 rounded-md px-3 border"
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
              className="z-50 min-w-[--radix-select-trigger-width] rounded-md border bg-white dark:bg-neutral-900 shadow-md"
            >
              <Select.Viewport className="p-1">
                <Select.Group>
                  {['breadthfirst', 'circle', 'concentric', 'elk', 'grid'].map(layout => (
                    <Select.Item
                      key={layout}
                      value={layout}
                      textValue={t(layout)}
                      className="px-2 py-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
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

      <h3>
        {t('settings.layoutSpacing')}: {cytoscapeLayoutSpacing}
      </h3>
      {/* Which Cytoscape layout spacing */}
      <Setting>
        <Slider.Root
          id="spacing"
          min={0.1}
          max={1}
          step={0.1}
          value={[cytoscapeLayoutSpacing]}
          onValueChange={([v]) => setCytoscapeLayoutSpacing(Number(v.toFixed(1)))}
          aria-label="Layout spacing"
          className="relative flex h-5 w-56 touch-none select-none items-center"
        >
          <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
            <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
          </Slider.Track>
          <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
        </Slider.Root>
      </Setting>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Settings), {
  ssr: false,
});

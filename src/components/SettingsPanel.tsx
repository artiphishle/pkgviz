'use client';
import { ChevronDownIcon } from 'lucide-react';
import { Select, Slider } from 'radix-ui';
import React from 'react';

import { SidebarRow } from '@/components/sidebar/SidebarRow';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import Switch from '@/components/Switch';
import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/i18n/i18n';

/*** Renders the persistent first-rank graph controls below secondary sidebar tools. */
export function SettingsPanel() {
  return (
    <>
      <FilterSettings />
      <SubPackageDepthSettings />
      <LayoutSettings />
      <LayoutSpacingSettings />
    </>
  );
}

/*** Renders package-visibility settings. */
function FilterSettings() {
  const {
    showCompoundNodes,
    showVendorPackages,
    toggleShowCompoundNodes,
    toggleShowVendorPackages,
  } = useSettings();

  return (
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
  );
}

/*** Renders the visible subpackage-depth control. */
function SubPackageDepthSettings() {
  const { maxSubPackageDepth, setSubPackageDepth, subPackageDepth } = useSettings();

  return (
    <SidebarSection title={t('settings.subPackageDepth') + ': ' + subPackageDepth}>
      <SidebarRow>
        <SettingsSlider
          ariaLabel={t('settings.subPackageDepth')}
          max={maxSubPackageDepth}
          min={1}
          step={1}
          value={subPackageDepth}
          onValueChange={setSubPackageDepth}
        />
      </SidebarRow>
    </SidebarSection>
  );
}

/*** Renders the active Cytoscape layout selector. */
function LayoutSettings() {
  const { cytoscapeLayout, setCytoscapeLayout } = useSettings();

  /*** Lets the Select close immediately before starting a potentially expensive graph layout. */
  const selectLayout = (layout: string) => {
    if (
      layout !== 'breadthfirst' &&
      layout !== 'circle' &&
      layout !== 'concentric' &&
      layout !== 'elk' &&
      layout !== 'grid'
    ) {
      return;
    }

    React.startTransition(() => setCytoscapeLayout(layout));
  };

  return (
    <SidebarSection title={t('settings.layout')}>
      <SidebarRow>
        <Select.Root value={cytoscapeLayout} onValueChange={selectLayout}>
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
  );
}

/*** Renders the active layout-spacing control. */
function LayoutSpacingSettings() {
  const { cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing } = useSettings();

  return (
    <SidebarSection title={t('settings.layoutSpacing') + ': ' + cytoscapeLayoutSpacing.toFixed(2)}>
      <SidebarRow>
        <SettingsSlider
          ariaLabel={t('settings.layoutSpacing')}
          max={1}
          min={0.1}
          step={0.01}
          value={cytoscapeLayoutSpacing}
          onValueChange={setCytoscapeLayoutSpacing}
        />
      </SidebarRow>
    </SidebarSection>
  );
}

/*** Renders the shared slider shape used by numeric sidebar settings. */
function SettingsSlider({ ariaLabel, max, min, onValueChange, step, value }: SettingsSliderProps) {
  return (
    <Slider.Root
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([nextValue]) => onValueChange(nextValue)}
      aria-label={ariaLabel}
      className="relative flex h-5 w-full touch-none select-none items-center"
    >
      <Slider.Track className="relative h-1.5 grow rounded-full bg-neutral-200 dark:bg-neutral-800">
        <Slider.Range className="absolute h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
      </Slider.Track>
      <Slider.Thumb className="block h-4 w-4 rounded-full border border-neutral-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-100" />
    </Slider.Root>
  );
}

interface SettingsSliderProps {
  readonly ariaLabel: string;
  readonly max: number;
  readonly min: number;
  readonly onValueChange: (value: number) => void;
  readonly step: number;
  readonly value: number;
}

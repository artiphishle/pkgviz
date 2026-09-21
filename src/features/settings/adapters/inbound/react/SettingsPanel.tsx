'use client';
import { Select } from '@zora/select';
import { Switch } from '@zora/switch';
import { Text } from '@zora/text';
import { View } from '@zora/view';
import type { LayoutOptions } from 'cytoscape';
import { Slider } from 'radix-ui';
import React from 'react';

import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/i18n/i18n';

const LAYOUT_OPTIONS: readonly LayoutOptions['name'][] = [
  'breadthfirst',
  'circle',
  'concentric',
  'elk',
  'grid',
];

/*** Renders persistent graph controls from generated ZORA form and layout elements. */
export function SettingsPanel() {
  return (
    <View gap="l" p="m">
      <FilterSettings />
      <SubPackageDepthSettings />
      <LayoutSettings />
      <LayoutSpacingSettings />
    </View>
  );
}

/*** Renders package-visibility settings through ZORA switches. */
function FilterSettings() {
  const {
    showCompoundNodes,
    showVendorPackages,
    toggleShowCompoundNodes,
    toggleShowVendorPackages,
  } = useSettings();

  return (
    <SettingsSection title={t('settings.filter')}>
      <Switch
        checked={showVendorPackages}
        onCheckedChange={(checked: boolean) => {
          if (checked !== showVendorPackages) toggleShowVendorPackages();
        }}
        testID="switch-show-vendor-packages"
      >
        {t('settings.showVendorPackages')}
      </Switch>
      <Switch
        checked={showCompoundNodes}
        onCheckedChange={(checked: boolean) => {
          if (checked !== showCompoundNodes) toggleShowCompoundNodes();
        }}
        testID="switch-show-compound-nodes"
      >
        {t('settings.showCompoundNodes')}
      </Switch>
    </SettingsSection>
  );
}

/*** Renders the visible subpackage-depth control. */
function SubPackageDepthSettings() {
  const { maxSubPackageDepth, setSubPackageDepth, subPackageDepth } = useSettings();

  return (
    <SettingsSection title={t('settings.subPackageDepth') + ': ' + subPackageDepth}>
      <SettingsSlider
        ariaLabel={t('settings.subPackageDepth')}
        max={maxSubPackageDepth}
        min={1}
        step={1}
        value={subPackageDepth}
        onValueChange={setSubPackageDepth}
      />
    </SettingsSection>
  );
}

/*** Renders the active graph layout selector through ZORA Select. */
function LayoutSettings() {
  const { cytoscapeLayout, setCytoscapeLayout } = useSettings();

  /*** Lets the Select close immediately before starting a potentially expensive graph layout. */
  const selectLayout = (layout: LayoutOptions['name']) => {
    React.startTransition(() => setCytoscapeLayout(layout));
  };

  return (
    <SettingsSection title={t('settings.layout')}>
      <Select
        value={cytoscapeLayout}
        options={LAYOUT_OPTIONS.map(value => ({ label: t(value), value }))}
        onValueChange={selectLayout}
        testID="cytoscape-layout"
      />
    </SettingsSection>
  );
}

/*** Renders the active layout-spacing control. */
function LayoutSpacingSettings() {
  const { cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing } = useSettings();

  return (
    <SettingsSection title={t('settings.layoutSpacing') + ': ' + cytoscapeLayoutSpacing.toFixed(2)}>
      <SettingsSlider
        ariaLabel={t('settings.layoutSpacing')}
        max={1}
        min={0.1}
        step={0.01}
        value={cytoscapeLayoutSpacing}
        onValueChange={setCytoscapeLayoutSpacing}
      />
    </SettingsSection>
  );
}

/*** Composes one settings group from ZORA layout and typography primitives. */
function SettingsSection({ children, title }: SettingsSectionProps) {
  return (
    <View gap="s">
      <Text variant="label" weight="bold">
        {title}
      </Text>
      {children}
    </View>
  );
}

/*** Renders the retained Radix slider until ZORA owns a canonical Slider element. */
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

interface SettingsSectionProps {
  readonly children: React.ReactNode;
  readonly title: React.ReactNode;
}

interface SettingsSliderProps {
  readonly ariaLabel: string;
  readonly max: number;
  readonly min: number;
  readonly onValueChange: (value: number) => void;
  readonly step: number;
  readonly value: number;
}

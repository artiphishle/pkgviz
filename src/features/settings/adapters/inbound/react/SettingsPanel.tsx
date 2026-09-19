'use client';
import type { LayoutOptions } from 'cytoscape';
import { Slider } from 'radix-ui';
import React from 'react';
import { Select } from '@zora/select';
import { Switch } from '@zora/switch';
import { Text } from '@zora/text';
import { View } from '@zora/view';

import { useSettings } from '@/contexts/SettingsContext';
import { t } from '@/i18n/i18n';
import type { ZoraMode } from '@/types/zora';

const LAYOUT_OPTIONS: readonly LayoutOptions['name'][] = [
  'breadthfirst',
  'circle',
  'concentric',
  'elk',
  'grid',
];

/*** Renders persistent graph controls from generated ZORA form and layout elements. */
export function SettingsPanel({ mode }: SettingsPanelProps) {
  return (
    <View mode={mode} gap="l" p="m">
      <FilterSettings mode={mode} />
      <SubPackageDepthSettings mode={mode} />
      <LayoutSettings mode={mode} />
      <LayoutSpacingSettings mode={mode} />
    </View>
  );
}

/*** Renders package-visibility settings through ZORA switches. */
function FilterSettings({ mode }: SettingsPanelProps) {
  const {
    showCompoundNodes,
    showVendorPackages,
    toggleShowCompoundNodes,
    toggleShowVendorPackages,
  } = useSettings();

  return (
    <SettingsSection mode={mode} title={t('settings.filter')}>
      <Switch
        checked={showVendorPackages}
        mode={mode}
        onCheckedChange={(checked: boolean) => {
          if (checked !== showVendorPackages) toggleShowVendorPackages();
        }}
        testID="switch-show-vendor-packages"
      >
        {t('settings.showVendorPackages')}
      </Switch>
      <Switch
        checked={showCompoundNodes}
        mode={mode}
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
function SubPackageDepthSettings({ mode }: SettingsPanelProps) {
  const { maxSubPackageDepth, setSubPackageDepth, subPackageDepth } = useSettings();

  return (
    <SettingsSection
      mode={mode}
      title={t('settings.subPackageDepth') + ': ' + subPackageDepth}
    >
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
function LayoutSettings({ mode }: SettingsPanelProps) {
  const { cytoscapeLayout, setCytoscapeLayout } = useSettings();

  return (
    <SettingsSection mode={mode} title={t('settings.layout')}>
      <Select
        mode={mode}
        value={cytoscapeLayout}
        options={LAYOUT_OPTIONS.map(value => ({ label: t(value), value }))}
        onValueChange={(value: LayoutOptions['name']) => setCytoscapeLayout(value)}
        testID="cytoscape-layout"
      />
    </SettingsSection>
  );
}

/*** Renders the active layout-spacing control. */
function LayoutSpacingSettings({ mode }: SettingsPanelProps) {
  const { cytoscapeLayoutSpacing, setCytoscapeLayoutSpacing } = useSettings();

  return (
    <SettingsSection
      mode={mode}
      title={t('settings.layoutSpacing') + ': ' + cytoscapeLayoutSpacing}
    >
      <SettingsSlider
        ariaLabel={t('settings.layoutSpacing')}
        max={1}
        min={0.1}
        step={0.1}
        value={cytoscapeLayoutSpacing}
        onValueChange={setCytoscapeLayoutSpacing}
      />
    </SettingsSection>
  );
}

/*** Composes one settings group from ZORA layout and typography primitives. */
function SettingsSection({ children, mode, title }: SettingsSectionProps) {
  return (
    <View mode={mode} gap="s">
      <Text mode={mode} variant="label" weight="bold">
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
      onValueChange={([nextValue]) => onValueChange(Number(nextValue.toFixed(1)))}
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

interface SettingsPanelProps {
  readonly mode: ZoraMode;
}

interface SettingsSectionProps extends SettingsPanelProps {
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

'use client';

import { Switch } from '@zora/switch';
import { View } from '@zora/view';
import { useZoraTheme } from '@zora/ZoraProvider';

/*** Renders an audit cycle toggle through ZORA with a data-driven cycle color indicator. */
export function CycleSwitch({ ariaLabel, checkedColor, id, onToggle, value }: CycleSwitchProps) {
  const { theme } = useZoraTheme();

  return (
    <View
      align="center"
      direction="row"
      gap="xs"
      style={{ flexShrink: 0, marginLeft: 'auto' }}
    >
      <span
        aria-hidden="true"
        style={{
          backgroundColor: value ? checkedColor : theme.semantics.content.subtle,
          borderRadius: 999,
          height: 8,
          opacity: value ? 1 : 0.6,
          width: 8,
        }}
      />
      <Switch
        accessibilityLabel={ariaLabel}
        checked={value}
        size="s"
        testID={id}
        onCheckedChange={(checked: boolean) => {
          if (checked !== value) onToggle();
        }}
      />
    </View>
  );
}

interface CycleSwitchProps {
  readonly ariaLabel: string;
  readonly checkedColor: string;
  readonly id: string;
  readonly onToggle: () => void;
  readonly value: boolean;
}

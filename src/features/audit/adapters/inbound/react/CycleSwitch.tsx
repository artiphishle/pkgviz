'use client';
import { Switch } from 'radix-ui';
import React from 'react';

/*** Renders the audit-only switch whose selected color must match its graph cycle exactly. */
export function CycleSwitch({
  ariaLabel,
  checkedColor,
  id,
  onToggle,
  value,
}: CycleSwitchProps) {
  return (
    <Switch.Root
      aria-label={ariaLabel}
      className="relative h-[18px] w-[42px] shrink-0 cursor-pointer rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-neutral-200 dark:bg-neutral-800 dark:data-[state=checked]:bg-gray-700"
      id={id}
      checked={value}
      onCheckedChange={onToggle}
    >
      <Switch.Thumb
        className="block size-[16px] translate-x-0.5 rounded-full bg-neutral-500 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-blue-500 dark:bg-neutral-500 dark:data-[state=checked]:bg-white"
        style={value ? { backgroundColor: checkedColor } : undefined}
      />
    </Switch.Root>
  );
}

interface CycleSwitchProps {
  readonly ariaLabel: string;
  readonly checkedColor: string;
  readonly id: string;
  readonly onToggle: () => void;
  readonly value: boolean;
}

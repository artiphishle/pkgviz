'use client';
import { Switch } from 'radix-ui';
import React from 'react';

/*** Renders a switch control without imposing row or label layout. */
export function ToggleSwitch({ ariaLabel, checkedColor, id, onToggle, value }: ToggleSwitchProps) {
  return (
    <Switch.Root
      aria-label={ariaLabel}
      className="relative h-[18px] w-[42px] shrink-0 cursor-pointer rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-neutral-200 dark:bg-neutral-800 dark:data-[state=checked]:bg-gray-700"
      id={id}
      checked={value}
      onCheckedChange={onToggle}
    >
      {value && checkedColor ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full opacity-25"
          style={{ backgroundColor: checkedColor }}
        />
      ) : null}
      <Switch.Thumb
        className="relative block size-[16px] translate-x-0.5 rounded-full bg-neutral-500 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-blue-500 dark:bg-neutral-500 dark:data-[state=checked]:bg-white"
        style={value && checkedColor ? { backgroundColor: checkedColor } : undefined}
      />
    </Switch.Root>
  );
}

interface ToggleSwitchProps {
  readonly ariaLabel: string;
  readonly checkedColor?: string;
  readonly id: string;
  readonly value: boolean;
  readonly onToggle: () => void;
}

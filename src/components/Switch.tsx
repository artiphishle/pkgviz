'use client';
import React from 'react';

import { ToggleSwitch } from '@/components/ToggleSwitch';

/*** Renders a labeled settings switch. */
export default function RadixSwitch({ id, label, value, onToggle }: ISwitch) {
  return (
    <div className="flex h-[20px] items-center justify-between">
      <label className="pr-[15px] leading-none whitespace-nowrap text-foreground" htmlFor={id}>
        {label}
      </label>
      <ToggleSwitch ariaLabel={label} id={id} onToggle={onToggle} value={value} />
    </div>
  );
}

interface ISwitch {
  readonly id: string;
  readonly label: string;
  readonly value: boolean;
  readonly onToggle: () => void;
}

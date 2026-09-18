'use client';
import { Switch } from 'radix-ui';
import React from 'react';

/*** Renders the shared settings switch. */
export default function RadixSwitch({ ariaLabel, id, label, value, onToggle }: ISwitch) {
  return (
    <div className="flex h-[20px] items-center justify-between">
      {label ? (
        <label className="pr-[15px] leading-none text-foreground whitespace-nowrap" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <Switch.Root
        aria-label={ariaLabel ?? label}
        className="relative h-[18px] w-[42px] cursor-default rounded-full bg-neutral-200 outline-none data-[state=checked]:bg-neutral-200 dark:bg-neutral-800 dark:data-[state=checked]:bg-gray-700"
        id={id}
        checked={value}
        onCheckedChange={onToggle}
      >
        <Switch.Thumb className="block size-[16px] translate-x-0.5 rounded-full bg-neutral-500 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[24px] data-[state=checked]:bg-blue-500 dark:bg-neutral-500 dark:data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}

interface ISwitch {
  readonly ariaLabel?: string;
  readonly id: string;
  readonly label?: string;
  readonly value: boolean;
  readonly onToggle: () => void;
}

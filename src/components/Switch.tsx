'use client';
import { Switch } from 'radix-ui';
import React from 'react';

/*** Renders the shared settings switch. */
export default function RadixSwitch({ id, label, value, onToggle }: ISwitch) {
  return (
    <form>
      <div className="flex items-center justify-between h-[20px]">
        <label className="pr-[15px] leading-none text-foreground whitespace-nowrap" htmlFor={id}>
          {label}
        </label>
        <Switch.Root
          className="relative h-[18px] w-[42px] cursor-default rounded-full bg-neutral-200 dark:bg-neutral-800 outline-none data-[state=checked]:bg-neutral-200 dark:data-[state=checked]:bg-gray-700"
          defaultChecked={value}
          id={id}
          checked={value}
          onCheckedChange={onToggle}
        >
          <Switch.Thumb className="block size-[16px] translate-x-0.5 rounded-full bg-neutral-500 dark:bg-neutral-500 transition-transform duration-100 will-change-transform data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-white data-[state=checked]:translate-x-[24px]" />
        </Switch.Root>
      </div>
    </form>
  );
}

interface ISwitch {
  readonly id: string;
  readonly label: string;
  readonly value: boolean;
  readonly onToggle: () => void;
}

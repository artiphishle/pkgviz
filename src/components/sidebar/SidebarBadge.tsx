import React from 'react';

/*** Renders a compact circular count badge for sidebar findings. */
export function SidebarBadge({ count }: SidebarBadgeProps) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-[10px] font-semibold leading-none text-neutral-700 dark:border-neutral-700 dark:text-neutral-200">
      {count}
    </span>
  );
}

interface SidebarBadgeProps {
  readonly count: number;
}

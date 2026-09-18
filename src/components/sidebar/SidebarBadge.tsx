import React from 'react';

/*** Renders a compact circular count badge for sidebar findings and secondary tabs. */
export function SidebarBadge({ count, tone = 'neutral' }: SidebarBadgeProps) {
  const toneClass =
    tone === 'danger'
      ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
      : 'border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:text-neutral-200';

  return (
    <span
      className={
        'inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full border px-1 text-[10px] font-semibold leading-none ' +
        toneClass
      }
    >
      {count}
    </span>
  );
}

interface SidebarBadgeProps {
  readonly count: number;
  readonly tone?: 'danger' | 'neutral';
}

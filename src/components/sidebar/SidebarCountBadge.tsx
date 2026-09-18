/*** Renders the compact circular finding count used by sidebar categories. */
export function SidebarCountBadge({ count }: SidebarCountBadgeProps) {
  return (
    <span className="inline-flex size-5 items-center justify-center rounded-full bg-neutral-200 text-[11px] font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100">
      {count}
    </span>
  );
}

interface SidebarCountBadgeProps {
  readonly count: number;
}

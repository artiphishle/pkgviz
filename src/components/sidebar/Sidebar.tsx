import React from 'react';

/*** Renders the fixed-width application sidebar shell. */
export function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex min-h-0 w-[18rem] min-w-[18rem] max-w-[18rem] shrink-0 self-stretch flex-col overflow-hidden border-r border-r-neutral-200 bg-neutral-100 md:pt-14 dark:border-r-neutral-800 dark:bg-neutral-950">
      {children}
    </aside>
  );
}

interface SidebarProps {
  readonly children: React.ReactNode;
}

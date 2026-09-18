import React from 'react';

import { SidebarTabs } from '@/components/sidebar/SidebarTabs';

/*** Renders the fixed-width application sidebar, optionally with a tabbed content surface. */
export function Sidebar({ children, tabs }: SidebarProps) {
  return (
    <aside className="w-[18rem] min-w-[18rem] max-w-[18rem] shrink-0 overflow-x-hidden overflow-y-auto border-r border-r-neutral-200 bg-neutral-100 md:pt-14 dark:border-r-neutral-800 dark:bg-neutral-950">
      {tabs === undefined ? children : <SidebarTabs tabs={tabs} />}
    </aside>
  );
}

interface SidebarProps {
  readonly children?: React.ReactNode;
  readonly tabs?: React.ComponentProps<typeof SidebarTabs>['tabs'];
}

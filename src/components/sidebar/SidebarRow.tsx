import React from 'react';

/*** Renders one consistently styled row inside an application-sidebar section. */
export function SidebarRow({ children }: SidebarRowProps) {
  return (
    <div className="ml-3 border-b border-b-neutral-200 bg-white px-3 py-2 dark:border-b-neutral-800 dark:bg-neutral-900">
      {children}
    </div>
  );
}

interface SidebarRowProps {
  readonly children: React.ReactNode;
}

import React from 'react';

/*** Renders a non-collapsible application-sidebar category. */
export function SidebarSection({ children, title }: SidebarSectionProps) {
  return (
    <section>
      <h3 className="mx-6 mt-6 mb-2 text-sm font-bold">{title}</h3>
      {children}
    </section>
  );
}

interface SidebarSectionProps {
  readonly children: React.ReactNode;
  readonly title: React.ReactNode;
}

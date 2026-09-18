import type { ReactNode } from 'react';

/*** Renders one titled section in the fixed PKGViz sidebar. */
export function SidebarSection({ children, title }: SidebarSectionProps) {
  return (
    <section>
      <h3>{title}</h3>
      {children}
    </section>
  );
}

interface SidebarSectionProps {
  readonly children: ReactNode;
  readonly title: ReactNode;
}

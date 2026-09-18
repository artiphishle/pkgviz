'use client';
import React from 'react';
import { Tabs } from 'radix-ui';

import { t } from '@/i18n/i18n';

/*** Renders the fixed-width application sidebar with settings and rules tabs. */
export function Sidebar({ settings, rules }: SidebarProps) {
  return (
    <aside className="w-[18rem] min-w-[18rem] max-w-[18rem] shrink-0 overflow-x-hidden overflow-y-auto border-r border-r-neutral-200 bg-neutral-100 md:pt-14 dark:border-r-neutral-800 dark:bg-neutral-950">
      <Tabs.Root defaultValue="settings">
        <Tabs.List
          aria-label={t('sidebar.navigation')}
          className="ml-3 flex border-b border-neutral-200 dark:border-neutral-800"
        >
          <SidebarTab value="settings">{t('settings.title')}</SidebarTab>
          <SidebarTab value="rules">{t('settings.rules')}</SidebarTab>
        </Tabs.List>
        <Tabs.Content value="settings" className="outline-none">
          {settings}
        </Tabs.Content>
        <Tabs.Content value="rules" className="outline-none">
          {rules}
        </Tabs.Content>
      </Tabs.Root>
    </aside>
  );
}

/*** Renders one application-sidebar tab trigger. */
function SidebarTab({ children, value }: SidebarTabProps) {
  return (
    <Tabs.Trigger
      value={value}
      className="flex-1 border-b-2 border-transparent px-3 py-2 text-xs text-neutral-500 data-[state=active]:border-blue-600 data-[state=active]:text-neutral-900 dark:text-neutral-400 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-neutral-100"
    >
      {children}
    </Tabs.Trigger>
  );
}

interface SidebarProps {
  readonly settings: React.ReactNode;
  readonly rules: React.ReactNode;
}

interface SidebarTabProps {
  readonly children: React.ReactNode;
  readonly value: string;
}

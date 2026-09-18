'use client';
import React from 'react';
import { Tabs } from 'radix-ui';

/*** Renders a reusable tab surface for sidebar views that must be mutually exclusive. */
export function SidebarTabs({ tabs }: SidebarTabsProps) {
  const [firstTab] = tabs;
  if (firstTab === undefined) return null;

  return (
    <Tabs.Root defaultValue={firstTab.id}>
      <Tabs.List
        aria-label="Sidebar sections"
        className="ml-3 flex border-b border-neutral-200 dark:border-neutral-800"
      >
        {tabs.map(tab => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            className="flex-1 border-b-2 border-transparent px-3 py-2 text-xs text-neutral-500 data-[state=active]:border-blue-600 data-[state=active]:text-neutral-900 dark:text-neutral-400 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-neutral-100"
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content key={tab.id} value={tab.id} className="outline-none">
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

interface SidebarTabsProps {
  readonly tabs: readonly SidebarTab[];
}

interface SidebarTab {
  readonly id: string;
  readonly label: React.ReactNode;
  readonly content: React.ReactNode;
}

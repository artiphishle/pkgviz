'use client';
import { Tabs } from 'radix-ui';
import React from 'react';

import { SidebarBadge } from '@/components/sidebar/SidebarBadge';

/*** Renders reusable secondary sidebar views above the persistent graph settings. */
export function SidebarTabs({ ariaLabel, onValueChange, tabs, value }: SidebarTabsProps) {
  return (
    <Tabs.Root value={value ?? ''} onValueChange={onValueChange}>
      <Tabs.List
        aria-label={ariaLabel}
        className="ml-3 flex border-b border-neutral-200 dark:border-neutral-800"
      >
        {tabs.map(tab => (
          <Tabs.Trigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className="flex flex-1 items-center justify-center gap-1.5 border-b-2 border-transparent px-3 py-2 text-xs text-neutral-500 disabled:cursor-default disabled:opacity-40 data-[state=active]:border-blue-600 data-[state=active]:text-neutral-900 dark:text-neutral-400 dark:data-[state=active]:border-blue-400 dark:data-[state=active]:text-neutral-100"
          >
            <span>{tab.label}</span>
            {tab.badge ? <SidebarBadge count={tab.badge} tone={tab.badgeTone} /> : null}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(tab => (
        <Tabs.Content
          key={tab.id}
          value={tab.id}
          className="max-h-56 overflow-y-auto border-b border-neutral-200 pb-3 outline-none dark:border-neutral-800"
        >
          {tab.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

interface SidebarTab {
  readonly badge?: number;
  readonly badgeTone?: 'danger' | 'neutral';
  readonly content: React.ReactNode;
  readonly disabled?: boolean;
  readonly id: string;
  readonly label: React.ReactNode;
}

interface SidebarTabsProps {
  readonly ariaLabel: string;
  readonly onValueChange: (value: string) => void;
  readonly tabs: readonly SidebarTab[];
  readonly value: string | null;
}

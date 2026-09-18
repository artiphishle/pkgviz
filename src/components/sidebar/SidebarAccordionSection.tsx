'use client';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';
import { Accordion } from 'radix-ui';

import { SidebarBadge } from '@/components/sidebar/SidebarBadge';

/*** Renders a sidebar category that can expose findings or a loading state. */
export function SidebarAccordionSection({
  children,
  count,
  disabled = false,
  loading = false,
  title,
}: SidebarAccordionSectionProps) {
  const hasFindings = count > 0;
  const isOpenByDefault = loading || hasFindings;
  const isDisabled = disabled || (!loading && !hasFindings);

  return (
    <Accordion.Root
      type="single"
      collapsible
      defaultValue={isOpenByDefault ? 'content' : undefined}
      className="mt-6"
    >
      <Accordion.Item value="content" disabled={isDisabled}>
        <Accordion.Header className="mx-6 my-0">
          <Accordion.Trigger className="group flex w-full items-center gap-2 py-2 text-left text-sm font-bold disabled:cursor-default disabled:text-neutral-400 dark:disabled:text-neutral-600">
            <span className="min-w-0 flex-1">{title}</span>
            {hasFindings && <SidebarBadge count={count} />}
            <ChevronDownIcon
              aria-hidden="true"
              size={14}
              className="shrink-0 transition-transform group-data-[state=open]:rotate-180 group-disabled:opacity-0"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden">{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

interface SidebarAccordionSectionProps {
  readonly children: React.ReactNode;
  readonly count: number;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly title: React.ReactNode;
}

import { ChevronDownIcon } from 'lucide-react';
import { Accordion } from 'radix-ui';
import type { ReactNode } from 'react';

import { SidebarCountBadge } from './SidebarCountBadge';

/*** Renders a sidebar category whose details can expand without changing sidebar width. */
export function SidebarAccordion({
  action,
  children,
  count,
  disabled,
  onOpenChange,
  open,
  title,
}: SidebarAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      value={open ? 'content' : ''}
      onValueChange={value => onOpenChange(value === 'content')}
    >
      <Accordion.Item value="content">
        <div className="flex items-center border-b border-b-neutral-200 bg-white dark:border-b-neutral-800 dark:bg-neutral-900">
          <Accordion.Header className="min-w-0 flex-1">
            <Accordion.Trigger
              disabled={disabled}
              className="group flex w-full min-w-0 items-center justify-between gap-2 px-3 py-2 text-left text-xs font-medium disabled:cursor-not-allowed disabled:text-neutral-400 dark:disabled:text-neutral-600"
            >
              <span className="min-w-0 flex-1 truncate">{title}</span>
              <span className="flex shrink-0 items-center gap-2">
                {count !== undefined && count > 0 ? <SidebarCountBadge count={count} /> : null}
                <ChevronDownIcon
                  size={14}
                  className="transition-transform group-data-[state=open]:rotate-180"
                />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          {action ? <div className="shrink-0 pr-3">{action}</div> : null}
        </div>
        <Accordion.Content className="overflow-hidden">{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

interface SidebarAccordionProps {
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly count?: number;
  readonly disabled: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly open: boolean;
  readonly title: ReactNode;
}

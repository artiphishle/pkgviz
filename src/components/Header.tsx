import React, { PropsWithChildren } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import { t } from '@/i18n/i18n';
import { parseProjectPath } from '@/contexts/parseEnv';

export default function Header({ children, title }: HeaderProps) {
  const projectPath = parseProjectPath();
  const projectName = projectPath.split('/').pop();

  return (
    <header className="flex flex-row items-center justify-between text-blue-50 bg-blue-500 dark:bg-blue-950 border-b-1 border-b-neutral-200 mb-1 dark:border-b-blue-800 p-2 pb-1 gap-4">
      {/* Left */}
      <div className="flex flex-row items-center justify-start">
        <h1 className="ml-4">{projectName}</h1>
        <span className="ml-2 opacity-20">&#47;</span>
        {title && <strong className="mx-2">{t(title)}</strong>}
        {children}
      </div>

      {/* Right */}
      <ThemeToggle />
    </header>
  );
}

interface HeaderProps extends PropsWithChildren {
  readonly title?: string;
}

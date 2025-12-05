'use client';
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  const parts = path.split('/') || [''];

  return (
    <nav className="flex items-center space-x-1 text-sm">
      <Link href="#" onClick={() => onNavigate('')} className="flex items-center text-foreground">
        <Home className="h-4 w-4 mr-1" />
      </Link>

      {parts.map((part, index) => {
        const currentPath = parts.length ? parts.slice(0, index + 1).join('.') : '';

        return (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-foreground opacity-20" />
            <Link href="#" onClick={() => onNavigate(currentPath)} className="ml-1 text-foreground">
              {part}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}

interface BreadcrumbProps {
  readonly path: string;
  readonly onNavigate: (path: string) => void;
}

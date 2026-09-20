import { LucideLoader } from 'lucide-react';
import React from 'react';

/*** Renders the loading indicator. */
export default function Loader() {
  return (
    <div
      data-testid="loader"
      role="status"
      aria-label="Loading"
      className="flex min-h-0 min-w-0 flex-1 items-center justify-center"
    >
      <LucideLoader />
    </div>
  );
}

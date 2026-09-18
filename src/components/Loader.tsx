import { LucideLoader } from 'lucide-react';
import React from 'react';

/*** Renders the loading indicator. */
export default function Loader() {
  return (
    <div data-testid="loader" className="h-full flex items-center justify-center">
      <LucideLoader />
    </div>
  );
}

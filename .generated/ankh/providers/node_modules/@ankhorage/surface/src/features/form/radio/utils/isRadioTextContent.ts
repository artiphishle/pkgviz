import type React from 'react';

/*** Reports whether Radio content should use the built-in text-label presentation. */
export function isRadioTextContent(children: React.ReactNode): children is string | number {
  return typeof children === 'string' || typeof children === 'number';
}

import React from 'react';

import type { DividerProps } from '../../../../types/layout';
import { View } from './View';

/*** Renders a horizontal or vertical separator using layout tokens. */
export function Divider({
  orientation = 'horizontal',
  color = 'border',
  thickness = 1,
  ...props
}: DividerProps) {
  return (
    <View
      {...props}
      bg={color}
      height={orientation === 'horizontal' ? thickness : '100%'}
      width={orientation === 'vertical' ? thickness : '100%'}
    />
  );
}

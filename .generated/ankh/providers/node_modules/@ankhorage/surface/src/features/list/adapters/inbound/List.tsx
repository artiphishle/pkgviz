import React from 'react';

import type { ListProps } from '../../../../types/list';
import { View } from '../../../layout/public';

/*** Groups list items under one neutral Surface list boundary. */
export function List({ children, testID }: ListProps) {
  return <View testID={testID}>{children}</View>;
}

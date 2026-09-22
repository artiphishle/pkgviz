import React from 'react';
import { View, type ViewStyle } from 'react-native';

import type { AccordionContentProps } from '../../../../types/accordion';
import { AccordionItemContext } from './AccordionItemContext';

/*** Renders an accordion item's content when expanded or force-mounted. */
export function AccordionContent({
  children,
  forceMount = false,
  style,
  ...viewProps
}: AccordionContentProps) {
  const item = React.use(AccordionItemContext);
  if (!item) throw new Error('AccordionContent must be rendered inside AccordionItem.');
  if (!item.open && !forceMount) return null;

  return (
    <View
      {...viewProps}
      accessibilityLabelledBy={item.triggerId}
      nativeID={item.contentId}
      style={[!item.open ? hiddenContentStyle : undefined, style]}
    >
      {children}
    </View>
  );
}

const hiddenContentStyle: ViewStyle = { display: 'none' };

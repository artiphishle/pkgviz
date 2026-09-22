import React from 'react';
import { Platform, Pressable, View } from 'react-native';

import type { TooltipProps } from '../../../../types/tooltip';
import { Popover } from '../../../popover/public';
import { Surface } from '../../../surface/public';
import { useTheme } from '../../../theme/runtime';
import { Text } from '../../../typography/public';
import { useTooltipVisibility } from '../../composition/useTooltipVisibility';

/*** Presents delayed hover/focus help through the shared Popover foundation. */
export function Tooltip({
  children,
  content,
  delay = 150,
  interactionPolicy = 'enabled',
  placement = 'top',
  testID,
}: TooltipProps) {
  const { theme } = useTheme();
  const passive = interactionPolicy === 'passive';
  const { hide, setVisible, show, visible } = useTooltipVisibility(delay, passive);

  return (
    <Popover
      closeOnOutsidePress={false}
      interactionPolicy={interactionPolicy}
      onOpenChange={setVisible}
      open={visible}
      placement={placement}
      testID={testID}
      anchor={() => (
        <Pressable
          onBlur={passive ? undefined : hide}
          onFocus={passive ? undefined : show}
          onHoverIn={Platform.OS === 'web' && !passive ? show : undefined}
          onHoverOut={Platform.OS === 'web' && !passive ? hide : undefined}
        >
          {children}
        </Pressable>
      )}
    >
      <View pointerEvents="none">
        <Surface
          p="s"
          style={{ backgroundColor: theme.semantics.surface.inverse }}
          variant="raised"
        >
          <Text emphasis="inverse" variant="caption">
            {content}
          </Text>
        </Surface>
      </View>
    </Popover>
  );
}

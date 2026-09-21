'use client';
import { ActivityIndicator } from '@zora/activity-indicator';
import { View } from '@zora/view';
import React from 'react';

import { useThemeMode } from '@/features/theme/adapters/inbound/react/useThemeMode';

/*** Keeps the initial loading indicator compact while the project snapshot loads. */
export default function Loading() {
  const { mode } = useThemeMode();

  return (
    <View mode={mode} align="center" justify="center" p="l" style={{ alignSelf: 'center' }}>
      <ActivityIndicator mode={mode} testID="loader" />
    </View>
  );
}

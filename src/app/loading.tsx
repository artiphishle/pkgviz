'use client';
import { ActivityIndicator } from '@zora/activity-indicator';
import { View } from '@zora/view';
import { useTheme } from 'next-themes';
import React from 'react';

/*** Keeps the centered ZORA loading indicator visible while the project snapshot loads. */
export default function Loading() {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <View mode={mode} align="center" flex={1} justify="center">
      <ActivityIndicator mode={mode} testID="loader" />
    </View>
  );
}

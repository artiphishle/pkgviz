'use client';
import { ActivityIndicator } from '@zora/activity-indicator';
import { View } from '@zora/view';
import React from 'react';

/*** Keeps the initial loading indicator compact while the project snapshot loads. */
export default function Loading() {
  return (
    <View align="center" justify="center" p="l" style={{ alignSelf: 'center' }}>
      <ActivityIndicator testID="loader" />
    </View>
  );
}

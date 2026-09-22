import React from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { resolvePointerEvents } from '../resolvePointerEvents';
import {
  createOverlayEntry,
  type OverlayDescriptor,
  type OverlayEntry,
  OverlayStackActionsContext,
  OverlayStackContext,
  sortOverlayEntries,
} from './useOverlayStack';

const boxNonePointerEvents = resolvePointerEvents('box-none');
const styles = StyleSheet.create({
  fill: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

/*** Installs the shared overlay stack used by portal-based Surface features. */
export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const orderRef = React.useRef(0);
  const [overlays, setOverlays] = React.useState<OverlayEntry[]>([]);

  const setOverlay = React.useCallback((id: string, descriptor: OverlayDescriptor) => {
    setOverlays((current) => {
      const existing = current.find((entry) => entry.id === id);
      const nextEntry = createOverlayEntry(id, existing?.order ?? orderRef.current++, descriptor);

      if (!existing) {
        return sortOverlayEntries([...current, nextEntry]);
      }

      return sortOverlayEntries(current.map((entry) => (entry.id === id ? nextEntry : entry)));
    });
  }, []);

  const removeOverlay = React.useCallback((id: string) => {
    setOverlays((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const actions = React.useMemo(
    () => ({
      removeOverlay,
      setOverlay,
    }),
    [removeOverlay, setOverlay],
  );

  const value = React.useMemo(
    () => ({
      overlays,
      removeOverlay,
      setOverlay,
    }),
    [overlays, removeOverlay, setOverlay],
  );

  return (
    <OverlayStackActionsContext value={actions}>
      <OverlayStackContext value={value}>
        {children}
        <View {...boxNonePointerEvents.props} style={[boxNonePointerEvents.style, styles.fill]}>
          {overlays.map((overlay) => (
            <View
              {...boxNonePointerEvents.props}
              key={overlay.id}
              style={[boxNonePointerEvents.style, styles.fill, overlayZIndex(overlay.zIndex)]}
            >
              {overlay.node}
            </View>
          ))}
        </View>
      </OverlayStackContext>
    </OverlayStackActionsContext>
  );
}

/*** Resolves a per-entry z-index style for the overlay host. */
function overlayZIndex(zIndex: number): ViewStyle {
  return { zIndex };
}

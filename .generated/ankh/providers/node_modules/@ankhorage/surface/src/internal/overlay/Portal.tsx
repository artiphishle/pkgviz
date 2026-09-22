import React from 'react';

import type { OverlayLayer } from '../resolvers/resolveOverlayZIndex';
import { useOverlayStackActions } from './useOverlayStack';

let portalCounter = 0;

export interface PortalProps {
  children?: React.ReactNode;
  layer?: OverlayLayer;
  visible?: boolean;
}

export function Portal({ children, layer = 'modal', visible = true }: PortalProps) {
  const overlayActions = useOverlayStackActions();
  const idRef = React.useRef(`surface-portal-${portalCounter++}`);

  React.useEffect(() => {
    if (!overlayActions || !visible) {
      return undefined;
    }
    const id = idRef.current;

    return () => {
      overlayActions.removeOverlay(id);
    };
  }, [overlayActions, visible]);

  React.useEffect(() => {
    if (!overlayActions || !visible) {
      return;
    }

    if (children === undefined || children === null) {
      overlayActions.removeOverlay(idRef.current);
      return;
    }

    overlayActions.setOverlay(idRef.current, {
      layer,
      node: children,
    });
  }, [children, layer, overlayActions, visible]);

  if (!overlayActions) {
    return visible ? <>{children}</> : null;
  }

  return null;
}

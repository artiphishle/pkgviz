"use strict";

import { findNodeHandle as _findNodeHandle } from 'react-native';

/**
 * Type bridge for accessing undocumented React Native scroll component internals.
 * These properties exist at runtime but aren't exposed in RN's public type definitions.
 *
 * @see https://github.com/facebook/react-native/blob/main/packages/virtualized-lists/Lists/VirtualizedList.js#L1252
 */

export function findNodeHandle(componentOrHandle) {
  // Early return for null/undefined (React 19 fix)
  if (componentOrHandle == null) {
    return null;
  }
  let nodeHandle = null;
  try {
    nodeHandle = _findNodeHandle(componentOrHandle);
    if (nodeHandle) {
      return nodeHandle;
    }
  } catch {}

  // Type bridge: componentOrHandle may have scroll internals at runtime
  const scrollable = componentOrHandle;
  try {
    if (typeof scrollable.getNativeScrollRef === 'function') {
      nodeHandle = scrollable.getNativeScrollRef();
      if (nodeHandle) {
        return nodeHandle;
      }
    }
  } catch {}
  try {
    if (typeof scrollable.getScrollableNode === 'function') {
      nodeHandle = scrollable.getScrollableNode();
      if (nodeHandle) {
        return nodeHandle;
      }
    }
  } catch {}
  if (scrollable._scrollRef != null) {
    return scrollable._scrollRef;
  }
  console.warn('could not find scrollable ref!');
  return componentOrHandle;
}
//# sourceMappingURL=findNodeHandle.web.js.map
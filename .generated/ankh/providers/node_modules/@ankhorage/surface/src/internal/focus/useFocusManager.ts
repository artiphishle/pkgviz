import React from 'react';

interface FocusableTarget {
  focus: () => void;
  disabled?: boolean;
  hidden?: boolean;
  tabIndex?: number;
  getAttribute?: (name: string) => string | null;
}

interface FocusContainer {
  contains: (node: unknown) => boolean;
  querySelectorAll: (selector: string) => ArrayLike<FocusableTarget>;
}

interface WebKeyboardEventLike {
  key?: string;
  preventDefault: () => void;
  shiftKey?: boolean;
}

interface WebDocumentLike {
  activeElement: unknown;
  addEventListener: (type: 'keydown', listener: (event: WebKeyboardEventLike) => void) => void;
  removeEventListener: (type: 'keydown', listener: (event: WebKeyboardEventLike) => void) => void;
}

const FOCUSABLE_SELECTOR = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';

function getWebDocument(): WebDocumentLike | null {
  const maybeDocument = (globalThis as { document?: unknown }).document;

  if (!maybeDocument || typeof maybeDocument !== 'object') {
    return null;
  }

  return maybeDocument as WebDocumentLike;
}

function isFocusableTarget(target: FocusableTarget): boolean {
  if (target.disabled || target.hidden) {
    return false;
  }

  if (typeof target.tabIndex === 'number' && target.tabIndex < 0) {
    return false;
  }

  const ariaHidden = target.getAttribute?.('aria-hidden');
  if (ariaHidden === 'true') {
    return false;
  }

  const tabIndexAttribute = target.getAttribute?.('tabindex');
  if (tabIndexAttribute === '-1') {
    return false;
  }

  return true;
}

export function getFocusableElements(container: unknown): FocusableTarget[] {
  if (!container || typeof container !== 'object') {
    return [];
  }

  const focusContainer = container as FocusContainer;
  if (typeof focusContainer.querySelectorAll !== 'function') {
    return [];
  }

  return Array.from(focusContainer.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isFocusableTarget);
}

export function useFocusManager() {
  const previousFocusRef = React.useRef<FocusableTarget | null>(null);

  const capturePreviousFocus = React.useCallback(() => {
    const documentRef = getWebDocument();
    const activeElement = documentRef?.activeElement;

    previousFocusRef.current =
      activeElement && typeof activeElement === 'object' && 'focus' in activeElement
        ? (activeElement as FocusableTarget)
        : null;
  }, []);

  const focusFirst = React.useCallback((container: unknown) => {
    const [firstFocusable] = getFocusableElements(container);

    firstFocusable?.focus();
  }, []);

  const restorePreviousFocus = React.useCallback(() => {
    previousFocusRef.current?.focus();
  }, []);

  const cycleFocus = React.useCallback((container: unknown, reverse = false) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) {
      return;
    }

    const documentRef = getWebDocument();
    const activeElement = documentRef?.activeElement;
    const currentIndex = focusableElements.findIndex((element) => element === activeElement);

    if (currentIndex === -1) {
      (reverse ? focusableElements[focusableElements.length - 1] : focusableElements[0])?.focus();
      return;
    }

    const nextIndex = reverse
      ? (currentIndex - 1 + focusableElements.length) % focusableElements.length
      : (currentIndex + 1) % focusableElements.length;

    focusableElements[nextIndex]?.focus();
  }, []);

  const bindKeydown = React.useCallback((listener: (event: WebKeyboardEventLike) => void) => {
    const documentRef = getWebDocument();
    if (!documentRef) {
      return () => {
        /* no-op */
      };
    }

    documentRef.addEventListener('keydown', listener);

    return () => {
      documentRef.removeEventListener('keydown', listener);
    };
  }, []);

  return {
    bindKeydown,
    capturePreviousFocus,
    cycleFocus,
    focusFirst,
    restorePreviousFocus,
  };
}

import { expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';

await mock.module('react-native', () => ReactNativeWeb);

const scrollContentStyle = { padding: 4 };

const { Grid, ScrollView, View } = await import('./features/layout/public');
const { KeyboardAvoidingView } = await import('./features/keyboard-avoiding-view/public');
const { Show } = await import('./core/responsive/Show');
const { OverlayProvider } = await import('./internal/overlay/OverlayProvider');
const { ThemeProvider } = await import('./features/theme/runtime');

function ResponsiveAcceptanceTree() {
  return (
    <ThemeProvider>
      <View maxWidth={{ base: 640, md: 960 }} px={{ base: 12, md: 24 }} testID="container">
        <ScrollView contentContainerStyle={scrollContentStyle} testID="scroll-view">
          <Grid cols={{ base: 1, md: 2 }} gap={{ base: 8, md: 16 }} testID="grid">
            <ReactNativeWeb.View testID="grid-first" />
            <ReactNativeWeb.View testID="grid-second" />
          </Grid>
          <Show
            fallback={<ReactNativeWeb.Text>static-fallback</ReactNativeWeb.Text>}
            when={{ base: false, md: true }}
          >
            <ReactNativeWeb.Text>wide-content</ReactNativeWeb.Text>
          </Show>
        </ScrollView>
      </View>
    </ThemeProvider>
  );
}

test('RN Web 0.21 statically renders and hydrates representative responsive primitives', async () => {
  const markup = renderToString(<ResponsiveAcceptanceTree />);

  expect(markup).toContain('data-testid="container"');
  expect(markup).toContain('data-testid="scroll-view"');
  expect(markup).toContain('data-testid="grid"');
  expect(markup).toContain('static-fallback');
  expect(markup).not.toContain('wide-content');

  const browserWindow = new Window({ url: 'https://surface.test/' });
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    Node: browserWindow.Node,
    document: browserWindow.document,
    navigator: browserWindow.navigator,
    window: browserWindow,
  });
  const container = browserWindow.document.createElement('div');
  container.innerHTML = markup;
  browserWindow.document.body.append(container);
  const hydrationErrors: string[] = [];
  const originalError = console.error;
  console.error = (...values: unknown[]) => {
    hydrationErrors.push(values.map(String).join(' '));
  };

  try {
    const { hydrateRoot } = await import('react-dom/client');
    const root = hydrateRoot(container as unknown as Element, <ResponsiveAcceptanceTree />);
    await act(async () => Promise.resolve());

    expect(container.querySelector('[data-testid="container"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="scroll-view"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-testid^="grid-"]')).toHaveLength(2);
    expect(hydrationErrors).toEqual([]);

    act(() => root.unmount());
  } finally {
    console.error = originalError;
    browserWindow.close();
    Reflect.deleteProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT');
    Reflect.deleteProperty(globalThis, 'Node');
    Reflect.deleteProperty(globalThis, 'document');
    Reflect.deleteProperty(globalThis, 'navigator');
    Reflect.deleteProperty(globalThis, 'window');
  }
});

test('RN Web 0.21 compiles box-none overlay pointer events into a hit-test-safe class', () => {
  const markup = renderToString(
    <OverlayProvider>
      <ReactNativeWeb.View testID="interactive-content" />
    </OverlayProvider>,
  );

  expect(markup).toContain('data-testid="interactive-content"');
  expect(markup).toContain('r-pointerEvents-');
});

test('RN Web 0.21 renders keyboard-safe content through the Surface layout boundary', () => {
  const markup = renderToString(
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      keyboardVerticalOffset={24}
      testID="keyboard-safe"
    >
      <ReactNativeWeb.Text>Keyboard-safe content</ReactNativeWeb.Text>
    </KeyboardAvoidingView>,
  );

  expect(markup).toContain('data-testid="keyboard-safe"');
  expect(markup).toContain('Keyboard-safe content');
});

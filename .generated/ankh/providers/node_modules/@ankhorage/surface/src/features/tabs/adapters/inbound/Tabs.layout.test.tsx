import { expect, mock, test } from 'bun:test';
import { Window } from 'happy-dom';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as ReactNativeWeb from 'react-native-web';

await mock.module('react-native', () => ReactNativeWeb);

const { ThemeProvider } = await import('../../../theme/runtime');
const { ScrollView } = await import('../../../layout/public');
const { TabPanel } = await import('./TabPanel');
const { Tabs } = await import('./Tabs');

test('forwards bounded layout to the active panel around a scrolling child', () => {
  const markup = renderToStaticMarkup(
    <ThemeProvider>
      <Tabs defaultValue="tree" flex={1} minHeight={0} overflow="hidden" testID="sidebar">
        <TabPanel flex={1} minHeight={0} testID="tree-panel" value="tree">
          <ScrollView flex={1} minHeight={0} testID="tree-scroll">
            <span>Deep tree</span>
          </ScrollView>
        </TabPanel>
        <TabPanel value="rules">
          <span>Hidden rules</span>
        </TabPanel>
      </Tabs>
    </ThemeProvider>,
  );

  const browserWindow = new Window();
  browserWindow.document.body.innerHTML = markup;
  const shell = browserWindow.document.querySelector('[data-testid="sidebar"]');
  const panel = browserWindow.document.querySelector('[data-testid="tree-panel"]');
  const scroll = browserWindow.document.querySelector('[data-testid="tree-scroll"]');

  expect(shell?.getAttribute('style')).toContain('flex:1');
  expect(shell?.getAttribute('style')).toContain('min-height:0px');
  expect(shell?.getAttribute('style')).toContain('overflow-y:hidden');
  expect(panel?.getAttribute('style')).toContain('flex:1');
  expect(panel?.getAttribute('style')).toContain('min-height:0px');
  expect(panel?.getAttribute('role')).toBe('tabpanel');
  expect(panel?.getAttribute('aria-labelledby')).toBe('sidebar-tabs-tab-tree');
  expect(scroll?.parentElement).toBe(panel);
  expect(browserWindow.document.body.textContent).not.toContain('Hidden rules');
  browserWindow.close();
});

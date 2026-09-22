import type { TabNavigationKey, TabRegistration } from '../../../types/tabs';

/*** Resolves the next enabled tab for keyboard focus navigation. */
export function resolveNextTabValue(
  tabs: readonly TabRegistration[],
  currentValue: string | undefined,
  key: TabNavigationKey,
): string | undefined {
  const enabledTabs = tabs.filter((tab) => !tab.disabled);
  if (enabledTabs.length === 0) return undefined;

  if (key === 'Home') return enabledTabs.at(0)?.value;
  if (key === 'End') return enabledTabs.at(-1)?.value;

  const currentIndex = enabledTabs.findIndex((tab) => tab.value === currentValue);
  if (currentIndex === -1) return enabledTabs.at(0)?.value;

  const nextIndex =
    key === 'ArrowLeft' || key === 'ArrowUp'
      ? (currentIndex - 1 + enabledTabs.length) % enabledTabs.length
      : (currentIndex + 1) % enabledTabs.length;

  return enabledTabs.at(nextIndex)?.value;
}

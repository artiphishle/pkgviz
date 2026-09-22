import { describe, expect, it } from 'bun:test';

import {
  ANKHORAGE_CAPABILITY_NAMES,
  type AnkhorageCapabilityName,
  type ComponentRequirements,
  type ScreenRequirements,
} from './index';

describe('platform requirements', () => {
  it('exports ebookReader as the canonical reader capability', () => {
    const capability: AnkhorageCapabilityName = 'ebookReader';
    const componentRequirements: ComponentRequirements = {
      capabilities: { [capability]: true },
    };
    const screenRequirements: ScreenRequirements = {
      capabilities: { [capability]: true },
    };

    expect(ANKHORAGE_CAPABILITY_NAMES).toContain(capability);
    expect(componentRequirements).toEqual(screenRequirements);
  });
});

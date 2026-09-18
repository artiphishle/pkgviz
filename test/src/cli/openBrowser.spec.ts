import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { openBrowser } from '../../../src/cli/openBrowser';

describe('[openBrowser]', () => {
  it('rejects non-http browser URLs before launching a process', () => {
    assert.throws(() => openBrowser('file:///tmp/pkgviz'), /Unsupported browser URL protocol: file:/);
    assert.throws(() => openBrowser('javascript:alert(1)'), /Unsupported browser URL protocol: javascript:/);
  });
});

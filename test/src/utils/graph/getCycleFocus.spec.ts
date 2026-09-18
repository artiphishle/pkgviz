import { describe, expect, it } from '@artiphishle/testosterone';

import { getCycleFocus } from '@/utils/graph/getCycleFocus';
import type { PackageCycleDetail } from '@/types/audit';

describe('[getCycleFocus]', () => {
  it('uses the nearest common package scope', () => {
    expect(getCycleFocus([cycle(['app.a', 'app.b', 'app.a'])])).toEqual({
      packagePath: 'app',
      subPackageDepth: 1,
    });
  });

  it('moves one scope up when the common package is part of the cycle', () => {
    expect(getCycleFocus([cycle(['app.a', 'app.a.deep', 'app.a'])])).toEqual({
      packagePath: 'app',
      subPackageDepth: 2,
    });
  });

  it('uses root scope for selected cycles from different package roots', () => {
    expect(
      getCycleFocus([
        cycle(['app.a', 'app.b', 'app.a']),
        cycle(['lib.x', 'lib.y', 'lib.x']),
      ])
    ).toEqual({
      packagePath: '',
      subPackageDepth: 2,
    });
  });
});

/*** Creates the minimal cycle fixture required by graph-focus tests. */
function cycle(packages: readonly string[]): PackageCycleDetail {
  return { packages, edges: [] };
}

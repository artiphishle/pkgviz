import { describe, expect, it } from '@artiphishle/testosterone';

import { resolveProjectTreeNavigation } from '@/features/project-tree/application/use-cases/resolveProjectTreeNavigation';

describe('[project tree navigation]', () => {
  const graph = ['a', 'a.b', 'a.b.child', 'a.bc', 'elsewhere'];

  it('navigates into a package with descendants, including upward navigation', () => {
    expect(
      resolveProjectTreeNavigation(
        { id: 'dir', kind: 'directory', label: 'b', graphPackage: 'a/b' },
        graph,
        'elsewhere'
      )
    ).toBe('a.b');
    expect(
      resolveProjectTreeNavigation(
        { id: 'dir', kind: 'directory', label: 'a', graphPackage: 'a' },
        graph,
        'a.b'
      )
    ).toBe('a');
  });

  it('preserves the current graph for leaf files, leaf packages, and unmapped entries', () => {
    for (const graphPackage of ['a.bc', 'a.b.child', '', 'missing']) {
      expect(
        resolveProjectTreeNavigation(
          { id: 'entry', kind: 'file', label: 'entry', graphPackage },
          graph,
          'a.b'
        )
      ).toBe('a.b');
    }
    expect(
      resolveProjectTreeNavigation(
        { id: 'entry', kind: 'directory', label: 'entry', graphPackage: 'a' },
        [],
        'elsewhere'
      )
    ).toBe('elsewhere');
  });
});

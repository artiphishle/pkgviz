import { describe, expect, it } from '@artiphishle/testosterone';

import { buildProjectTree } from '@/features/project-tree/application/use-cases/buildProjectTree';
import { getGraphRevealScope } from '@/features/project-tree/utils/getGraphRevealScope';
import type { ParsedDirectory } from '@/shared/types';

describe('[project tree]', () => {
  it('builds directories before files and preserves file graph packages', () => {
    const parsed = {
      src: {
        'index.ts': parsedFile('src/index.ts', 'src'),
        components: {
          'Button.tsx': parsedFile('src/components/Button.tsx', 'src.components'),
        },
      },
      'root.ts': parsedFile('root.ts', ''),
    } satisfies ParsedDirectory;

    const tree = buildProjectTree(parsed);

    expect(tree.map(node => node.label)).toEqual(['src', 'root.ts']);
    expect(tree[0]?.children?.map(node => node.label)).toEqual(['components', 'index.ts']);
    expect(tree[0]?.children?.[0]?.children?.[0]?.graphPackage).toBe('src.components');
  });

  it('reveals a package from its parent graph scope', () => {
    expect(getGraphRevealScope('src.components.sidebar')).toBe('src.components');
    expect(getGraphRevealScope('src')).toBe('');
  });
});

/*** Creates minimal parsed-file fixture data for project-tree tests. */
function parsedFile(path: string, packageName: string) {
  return {
    calls: [],
    className: path,
    imports: [],
    methods: [],
    package: packageName,
    path,
  };
}

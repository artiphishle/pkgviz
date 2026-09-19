import { describe, expect, it } from '@artiphishle/testosterone';

import { buildProjectTree } from '@/features/project-tree/application/use-cases/buildProjectTree';
import { findProjectTreeNodeByGraphPackage } from '@/features/project-tree/utils/findProjectTreeNodeByGraphPackage';
import type { ParsedDirectory } from '@/shared/types';

describe('[project tree]', () => {
  it('builds directories before files and derives directory graph packages from descendants', () => {
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
    expect(tree[0]?.graphPackage).toBe('src');
    expect(tree[0]?.children?.map(node => node.label)).toEqual(['components', 'index.ts']);
    expect(tree[0]?.children?.[0]?.graphPackage).toBe('src.components');
    expect(tree[0]?.children?.[0]?.children?.[0]?.graphPackage).toBe('src.components');
  });

  it('uses descendant package names instead of source-directory prefixes', () => {
    const parsed = {
      src: {
        main: {
          java: {
            io: {
              reflectoring: {
                'App.java': parsedFile(
                  'src/main/java/io/reflectoring/App.java',
                  'io.reflectoring'
                ),
              },
            },
          },
        },
      },
    } satisfies ParsedDirectory;

    const tree = buildProjectTree(parsed);

    expect(tree[0]?.graphPackage).toBe('io.reflectoring');
    expect(tree[0]?.children?.[0]?.children?.[0]?.graphPackage).toBe('io.reflectoring');
  });

  it('finds the deepest tree node that represents the active graph package', () => {
    const parsed = {
      src: {
        components: {
          'Button.tsx': parsedFile('src/components/Button.tsx', 'src.components'),
        },
      },
    } satisfies ParsedDirectory;

    const match = findProjectTreeNodeByGraphPackage(buildProjectTree(parsed), 'src.components');

    expect(match?.kind).toBe('directory');
    expect(match?.label).toBe('components');
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

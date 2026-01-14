import { describe,expect,it, } from '@artiphishle/testosterone';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';
import type { ElementsDefinition } from 'cytoscape';

describe('[filterEmptyPackage]', () => {
  it('skips empty intermediate packages and returns the first non-empty one', () => {
    const elements: ElementsDefinition = {
      nodes: [
        // Current package
        { data: { id: 'a' }, group: 'nodes' },
        // Only one child
        { data: { id: 'a.b' }, group: 'nodes' },
        // Multiple children of a.b
        { data: { id: 'a.b.c1' }, group: 'nodes' },
        { data: { id: 'a.b.c2' }, group: 'nodes' },
        // Unrelated node
        { data: { id: 'x.y.z' }, group: 'nodes' },
      ],
      edges: [],
    };

    const currentPackage = 'a';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a.b');
  });

  it('returns current package if it has multiple children', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'a' }, group: 'nodes' },
        { data: { id: 'a.b1' }, group: 'nodes' },
        { data: { id: 'a.b2' }, group: 'nodes' },
      ],
      edges: [],
    };
    const currentPackage = 'a';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a');
  });

  it('returns empty string if currentPath is empty and root has multiple children', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'a' }, group: 'nodes' },
        { data: { id: 'b' }, group: 'nodes' },
      ],
      edges: [],
    };
    const currentPackage = '';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('');
  });

  it('returns currentPackage currentPath is empty and root has only one child', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'a' }, group: 'nodes' },
        { data: { id: 'a.b1' }, group: 'nodes' },
        { data: { id: 'a.b2' }, group: 'nodes' },
      ],
      edges: [],
    };
    const currentPackage = '';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a');
  });

  it('returns current package if it has no children', () => {
    const elements: ElementsDefinition = {
      nodes: [
        { data: { id: 'a' }, group: 'nodes' },
        { data: { id: 'x.y.z' }, group: 'nodes' },
      ],
      edges: [],
    };

    const currentPackage = 'a';
    const result = filterEmptyPackages(currentPackage, elements);

    expect(result).toBe('a');
  });
});

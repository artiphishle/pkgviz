import { describe, expect, it } from '@artiphishle/testosterone';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';

describe('[filterByPackagePrefix]', () => {
  it('treats the selected package as scope and returns only its descendants', () => {
    const elements = {
      nodes: [{ data: { id: 'a.b' } }, { data: { id: 'a.b.c' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };

    const filteredElements = filterByPackagePrefix(elements, 'a.b');

    expect(filteredElements.nodes.map(({ data }) => data.id)).toEqual(['a.b.c']);
  });

  it('accepts a trailing separator without widening the package scope', () => {
    const elements = {
      nodes: [{ data: { id: 'a.b' } }, { data: { id: 'a.b.c' } }, { data: { id: 'a.bc' } }],
      edges: [],
    };

    const filteredElements = filterByPackagePrefix(elements, 'a.b.');

    expect(filteredElements.nodes.map(({ data }) => data.id)).toEqual(['a.b.c']);
  });
});

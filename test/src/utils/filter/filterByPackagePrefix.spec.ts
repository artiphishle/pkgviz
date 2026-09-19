import { describe, expect, it } from '@artiphishle/testosterone';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';

describe('[filterByPackagePrefix]', () => {
  it('keeps the selected package itself together with its descendants', () => {
    const elements = {
      nodes: [{ data: { id: 'a.b' } }, { data: { id: 'a.b.c' } }, { data: { id: 'x.y.z' } }],
      edges: [],
    };

    const filteredElements = filterByPackagePrefix(elements, 'a.b');
    const nodeIds = filteredElements.nodes.map(({ data }) => data.id);

    expect(nodeIds).toEqual(['a.b', 'a.b.c']);
  });

  it('accepts the legacy trailing separator without widening the package scope', () => {
    const elements = {
      nodes: [{ data: { id: 'a.b' } }, { data: { id: 'a.b.c' } }, { data: { id: 'a.bc' } }],
      edges: [],
    };

    const filteredElements = filterByPackagePrefix(elements, 'a.b.');

    expect(filteredElements.nodes.map(({ data }) => data.id)).toEqual(['a.b', 'a.b.c']);
  });
});

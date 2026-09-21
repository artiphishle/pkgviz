import { describe, expect, it } from '@artiphishle/testosterone';

import { resolveSelectedCycleIds } from '@/features/audit/application/use-cases/resolveSelectedCycleIds';
import { getCycleId } from '@/features/audit/utils/cycleVisualization';

const first = {
  packages: ['a', 'b', 'a'],
  edges: [
    { from: 'a', to: 'b', via: [] },
    { from: 'b', to: 'a', via: [] },
  ],
};
const second = { packages: ['c', 'd', 'c'], edges: [] };

describe('[persisted cycle choices]', () => {
  it('uses the environment for all cycles only when no explicit choice exists', () => {
    expect(resolveSelectedCycleIds([first, second], {}, false)).toEqual([]);
    expect(resolveSelectedCycleIds([first, second], {}, true)).toEqual([
      getCycleId(first),
      getCycleId(second),
    ]);
    expect(resolveSelectedCycleIds([first, second], { [getCycleId(first)]: false }, true)).toEqual([
      getCycleId(second),
    ]);
    expect(resolveSelectedCycleIds([first, second], { [getCycleId(second)]: true }, false)).toEqual(
      [getCycleId(second)]
    );
  });

  it('keeps identities across cycle ordering, starting package and changed evidence', () => {
    const rotated = { packages: ['b', 'a', 'b'], edges: [...first.edges].reverse() };
    expect(getCycleId(rotated)).toBe(getCycleId(first));
    expect(
      resolveSelectedCycleIds([second, rotated], { [getCycleId(first)]: true }, false)
    ).toEqual([getCycleId(first)]);
  });

  it('ignores invalid storage and invalid non-boolean choices', () => {
    expect(resolveSelectedCycleIds([first], null, false)).toEqual([]);
    expect(resolveSelectedCycleIds([first], { [getCycleId(first)]: 'false' }, true)).toEqual([
      getCycleId(first),
    ]);
  });
});

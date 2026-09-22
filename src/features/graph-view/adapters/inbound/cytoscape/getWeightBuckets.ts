import type { ElementsDefinition } from 'cytoscape';

/*** Computes edge-weight thresholds and bucket counts. */
export function getWeightBuckets(
  categoryCount: number,
  algorithm: 'linear' | 'log' | 'quantile' = 'linear',
  filteredElements: ElementsDefinition
) {
  const weights = filteredElements.edges.map(edge => Number(edge.data.weight));
  const max = getMaxEdgeWeight(filteredElements);
  const thresholds = createThresholds(categoryCount, algorithm, weights, max);

  return {
    thresholds: thresholds.map(Math.round),
    counts: countWeightsByThreshold(weights, thresholds),
  };
}

/*** Creates ordered thresholds for the selected edge-weight distribution policy. */
function createThresholds(
  categoryCount: number,
  algorithm: 'linear' | 'log' | 'quantile',
  weights: readonly number[],
  max: number
): readonly number[] {
  if (categoryCount <= 0) return [];
  if (algorithm === 'linear') {
    return Array.from({ length: categoryCount }, (_, index) =>
      index === categoryCount - 1 ? max : ((index + 1) * max) / categoryCount
    );
  }
  if (algorithm === 'log') {
    const logMax = Math.log(max);
    return Array.from({ length: categoryCount }, (_, index) =>
      index === categoryCount - 1 ? max : Math.exp(((index + 1) * logMax) / categoryCount)
    );
  }

  const sorted = [...weights].sort((left, right) => left - right);
  return Array.from({ length: categoryCount }, (_, index) => {
    if (index === categoryCount - 1) return max;
    const quantileIndex = Math.floor(((index + 1) * sorted.length) / categoryCount);
    return sorted.at(quantileIndex) ?? max;
  });
}

/*** Counts edge weights once per non-overlapping threshold range. */
function countWeightsByThreshold(
  weights: readonly number[],
  thresholds: readonly number[]
): readonly number[] {
  return thresholds.map((threshold, index) => {
    const previousThreshold = index === 0 ? Number.NEGATIVE_INFINITY : thresholds.at(index - 1);
    const lowerBound = previousThreshold ?? Number.NEGATIVE_INFINITY;
    return weights.filter(weight => weight > lowerBound && weight <= threshold).length;
  });
}

/*** Returns the largest numeric edge weight in the graph. */
function getMaxEdgeWeight(filteredElements: ElementsDefinition): number {
  return filteredElements.edges.reduce((max, edge) => {
    const weight = typeof edge.data.weight === 'number' ? edge.data.weight : 0;
    return weight > max ? weight : max;
  }, 0);
}

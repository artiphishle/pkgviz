import type { ElementsDefinition } from 'cytoscape';

export function getWeightBuckets(
  categoryCount: number,
  algorithm: 'linear' | 'log' | 'quantile' = 'linear',
  filteredElements: ElementsDefinition
) {
  if (!filteredElements) return { thresholds: [], counts: [] };

  const weights = filteredElements.edges.map(e => Number(e.data.weight));
  const max = getMaxEdgeWeight(filteredElements);

  const thresholds: number[] = [];
  const counts = new Array(categoryCount).fill(0);

  if (algorithm === 'linear') {
    for (let i = 1; i < categoryCount; i++) {
      thresholds.push((i * max) / categoryCount);
    }
    thresholds.push(max);
  } else if (algorithm === 'log') {
    const logMax = Math.log(max);
    for (let i = 1; i < categoryCount; i++) {
      thresholds.push(Math.exp((i * logMax) / categoryCount));
    }
    thresholds.push(max);
  } else if (algorithm === 'quantile') {
    const sorted = [...weights].sort((a, b) => a - b);
    for (let i = 1; i < categoryCount; i++) {
      const qIndex = Math.floor((i * sorted.length) / categoryCount);
      thresholds.push(sorted[qIndex]);
    }
    thresholds.push(max);
  }

  // Count how many weights fall into each bucket
  weights.forEach(w => {
    for (let i = 0; i < thresholds.length; i++) {
      if (w <= thresholds[i]) {
        counts[i]++;
        break;
      }
    }
  });

  return {
    thresholds: thresholds.map(Math.round),
    counts,
  };
}

export function getMaxEdgeWeight(filteredElements: ElementsDefinition) {
  return (
    filteredElements?.edges.reduce((max, edge) => {
      return edge.data.weight > max ? edge.data.weight : max;
    }, 0) ?? 0
  );
}

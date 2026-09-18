export interface GraphCycleHighlight {
  readonly id: string;
  readonly color: string;
  readonly nodeIds: readonly string[];
  readonly edges: readonly GraphCycleHighlightEdge[];
}

interface GraphCycleHighlightEdge {
  readonly source: string;
  readonly target: string;
}

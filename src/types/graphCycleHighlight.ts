export interface GraphCycleHighlight {
  readonly id: string;
  readonly color: string;
  readonly nodeIds: readonly string[];
  readonly edges: readonly GraphCycleHighlightEdge[];
}

export interface GraphCycleHighlightEdge {
  readonly source: string;
  readonly step: number;
  readonly target: string;
}

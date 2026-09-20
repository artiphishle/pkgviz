export interface ProjectTreeNode {
  readonly children?: readonly ProjectTreeNode[];
  readonly graphPackage: string;
  readonly id: string;
  readonly kind: 'directory' | 'file';
  readonly label: string;
}

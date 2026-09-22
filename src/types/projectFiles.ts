export interface ProjectImportMetadata {
  readonly name: string;
  readonly pkg: string;
  readonly isIntrinsic?: boolean;
}

export interface ProjectFileMetadata {
  readonly className: string;
  readonly imports: ProjectImportMetadata[];
  readonly package: string;
  readonly path: string;
}

export interface ProjectFileTree {
  [name: string]: ProjectFileTree | ProjectFileMetadata;
}

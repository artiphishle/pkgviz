///////////////////////////////////////////////////////////////////////////
// Language Detection Types

/**
 * List of supported coding languages
 */
export enum Language {
  Cpp = 'cpp',
  Delphi = 'delphi',
  JavaScript = 'javascript',
  Kotlin = 'kotlin',
  Python = 'python',
  TypeScript = 'typescript',
  Java = 'java',
  Unknown = 'unknown',
}

//////////////////////////////////////////////////////////////////////////
// Parser Types

export interface ParsedFile {
  readonly className: string;
  readonly imports: ImportDefinition[];
  readonly package: string;
  readonly path: string; // Relative path from project root
}

export interface ParsedDirectory {
  [k: string]: ParsedDirectory | ParsedFile;
}

/**
 * Import Definition
 */
export interface ImportDefinition {
  readonly name: string;
  readonly pkg: string;
  readonly isIntrinsic?: boolean;
}

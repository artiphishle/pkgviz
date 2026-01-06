///////////////////////////////////////////////////////////////////////////
// Language Detection Types

/**
 * List of supported coding languages
 */
export enum Language {
  Cpp = 'cpp',
  JavaScript = 'javascript',
  Python = 'python',
  TypeScript = 'typescript',
  Java = 'java',
  Unknown = 'unknown',
}

/**
 * Language Detection Result
 */
export interface LanguageDetectionResult {
  language: Language;
  confidence: number;
  indicators: string[];
}

//////////////////////////////////////////////////////////////////////////
// Parser Types

export interface ParsedFile {
  readonly calls: MethodCall[];
  readonly className: string;
  readonly imports: ImportDefinition[];
  readonly methods: MethodDefinition[];
  readonly package: string;
  readonly path: string; // Relative path from project root
}

export interface ParsedDirectory {
  [k: string]: ParsedDirectory | ParsedFile;
}

/**
 * Method Definition
 */
export interface MethodDefinition {
  readonly name: string;
  readonly returnType: string;
  readonly parameters: string[];
  readonly visibility: 'public' | 'protected' | 'private' | 'default';
}

/**
 * Method Call
 */
export interface MethodCall {
  readonly callee: string;
  readonly method: string;
}

/**
 * Import Definition
 */
export interface ImportDefinition {
  readonly name: string;
  readonly pkg: string;
  readonly isIntrinsic?: boolean;
}

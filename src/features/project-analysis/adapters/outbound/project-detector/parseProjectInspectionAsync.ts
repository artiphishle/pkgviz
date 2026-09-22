import path from 'node:path';

import type { DependencyGraph } from '@ankhorage/dependency-graph';
import type { ProjectInspection } from '@ankhorage/project-detector/types';
import { resolveFileSystemPathWithinRoot } from '@ankhorage/utility/node/fs';

import { parseCppFile } from '@/app/utils/parser/cpp/parseCppFile';
import { parseDelphiFile } from '@/app/utils/parser/delphi/parseFile';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseKotlinFile } from '@/app/utils/parser/kotlin/parseFile';
import { parsePythonFile } from '@/app/utils/parser/python/parseFile';
import { parseFile as parseTypeScriptFile } from '@/app/utils/parser/typescript/parseFile';
import { projectDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/projectDependencyImportsAsync';
import {
  type ImportDefinition,
  Language,
  type ParsedDirectory,
  type ParsedFile,
} from '@/shared/types';

interface ParseSourceInput {
  readonly analysisRootPath: string;
  readonly imports: readonly ImportDefinition[];
  readonly language: Language;
  readonly projectPath: string;
  readonly sourceFile: string;
}

/*** Project the canonical inspection inventory into PKGViz's parsed tree. */
export async function parseProjectInspectionAsync(
  inspection: ProjectInspection,
  dependencyGraph: DependencyGraph,
  language: Language,
  projectPath: string
): Promise<ParsedDirectory> {
  assertSupportedLanguage(language);

  const analysisRoot = analysisRootFor(inspection, language);
  const analysisRootPath = resolveFileSystemPathWithinRoot(projectPath, analysisRoot, {
    allowRoot: true,
  });
  const importsByFile = await importsForLanguageAsync(
    dependencyGraph,
    language,
    projectPath,
    analysisRootPath
  );
  const result = createParsedDirectory();
  const directories = new Map<string, ParsedDirectory>([['', result]]);

  for (const directory of inspection.directories) {
    const relativeDirectory = relativeToAnalysisRoot(directory, analysisRoot);
    if (relativeDirectory === undefined || relativeDirectory === '') continue;
    ensureDirectory(directories, relativeDirectory);
  }

  for (const sourceFile of inspection.files) {
    const relativeFile = relativeToAnalysisRoot(sourceFile, analysisRoot);
    if (
      relativeFile === undefined ||
      relativeFile === '' ||
      !isParserSourceFile(relativeFile, language)
    ) {
      continue;
    }

    const parsedFile = await parseSourceFileAsync({
      analysisRootPath,
      imports: importsByFile.get(relativeFile) ?? [],
      language,
      projectPath,
      sourceFile,
    });
    insertFile(directories, relativeFile, parsedFile);
  }

  return result;
}

/*** Preserve the established PKGViz tree root while consuming detector-owned source-root evidence. */
function analysisRootFor(inspection: ProjectInspection, language: Language): string {
  if (language === Language.TypeScript) return '.';
  return (
    inspection.detection.languages.find(candidate => candidate.id === String(language))
      ?.sourceRoots[0] ?? '.'
  );
}

/*** Convert one project-relative inventory path to the selected analysis-root-relative path. */
function relativeToAnalysisRoot(inventoryPath: string, analysisRoot: string): string | undefined {
  if (analysisRoot === '.') return inventoryPath;
  if (inventoryPath === analysisRoot) return '';
  const prefix = `${analysisRoot}/`;
  return inventoryPath.startsWith(prefix) ? inventoryPath.slice(prefix.length) : undefined;
}

/*** Create one null-prototype directory and index it by its relative path. */
function ensureDirectory(
  directories: Map<string, ParsedDirectory>,
  relativeDirectory: string
): ParsedDirectory {
  const existing = directories.get(relativeDirectory);
  if (existing !== undefined) return existing;

  const separator = relativeDirectory.lastIndexOf('/');
  const parentPath = separator < 0 ? '' : relativeDirectory.slice(0, separator);
  const directoryName = separator < 0 ? relativeDirectory : relativeDirectory.slice(separator + 1);
  const parent = ensureDirectory(directories, parentPath);
  const directory = createParsedDirectory();

  Object.defineProperty(parent, directoryName, {
    configurable: true,
    enumerable: true,
    value: directory,
    writable: true,
  });
  directories.set(relativeDirectory, directory);
  return directory;
}

/*** Insert one parsed file beneath its inventoried relative parent directory. */
function insertFile(
  directories: Map<string, ParsedDirectory>,
  relativeFile: string,
  parsedFile: ParsedFile
): void {
  const separator = relativeFile.lastIndexOf('/');
  const parentPath = separator < 0 ? '' : relativeFile.slice(0, separator);
  const fileName = separator < 0 ? relativeFile : relativeFile.slice(separator + 1);
  const parent = ensureDirectory(directories, parentPath);

  Object.defineProperty(parent, fileName, {
    configurable: true,
    enumerable: true,
    value: parsedFile,
    writable: true,
  });
}

/*** Create a dictionary-shaped directory node without Object prototype keys. */
function createParsedDirectory(): ParsedDirectory {
  return Object.setPrototypeOf({}, null) as ParsedDirectory;
}

/*** Return import evidence using the existing PKGViz presentation semantics per parser. */
async function importsForLanguageAsync(
  dependencyGraph: DependencyGraph,
  language: Language,
  projectPath: string,
  analysisRootPath: string
): Promise<ReadonlyMap<string, readonly ImportDefinition[]>> {
  switch (language) {
    case Language.TypeScript:
      return projectDependencyImportsAsync(dependencyGraph, projectPath);
    case Language.Java:
    case Language.Cpp:
      return projectDependencyImportsAsync(dependencyGraph, projectPath, analysisRootPath, 'specifier');
    case Language.Kotlin:
      return projectDependencyImportsAsync(
        dependencyGraph,
        projectPath,
        analysisRootPath,
        'specifier',
        'kotlin-standard-library'
      );
    case Language.Python:
      return projectDependencyImportsAsync(
        dependencyGraph,
        projectPath,
        analysisRootPath,
        'specifier',
        'python-legacy'
      );
    case Language.Delphi:
      return projectDependencyImportsAsync(
        dependencyGraph,
        projectPath,
        analysisRootPath,
        'specifier',
        'delphi-standard-library'
      );
    default:
      return new Map();
  }
}

/*** Parse one inventoried source file with the selected language adapter. */
async function parseSourceFileAsync(input: ParseSourceInput): Promise<ParsedFile> {
  const fullPath = resolveFileSystemPathWithinRoot(input.projectPath, input.sourceFile);
  switch (input.language) {
    case Language.Java:
      return parseJavaFile(fullPath, input.analysisRootPath, input.imports);
    case Language.TypeScript:
      return parseTypeScriptFile(fullPath, input.analysisRootPath, input.imports);
    case Language.Cpp:
      return parseCppFile(fullPath, input.analysisRootPath, input.imports);
    case Language.Python:
      return parsePythonFile(fullPath, input.analysisRootPath, input.imports);
    case Language.Delphi:
      return parseDelphiFile(fullPath, input.analysisRootPath, input.imports);
    case Language.Kotlin:
      return parseKotlinFile(fullPath, input.analysisRootPath, input.imports);
    default:
      throw new Error(`Unsupported parser language: ${input.language}`);
  }
}

/*** Keep parser-specific file acceptance independent from project-language detection evidence. */
function isParserSourceFile(relativeFile: string, language: Language): boolean {
  const extension = path.extname(relativeFile).toLowerCase();
  switch (language) {
    case Language.Java:
      return extension === '.java';
    case Language.TypeScript:
      return extension === '.ts' || extension === '.tsx';
    case Language.Cpp:
      return ['.cpp', '.cc', '.cxx', '.h', '.hpp', '.hxx'].includes(extension);
    case Language.Python:
      return extension === '.py';
    case Language.Delphi:
      return ['.pas', '.pp', '.dpr'].includes(extension);
    case Language.Kotlin:
      return extension === '.kt' || extension === '.kts';
    default:
      return false;
  }
}

/*** Fail before analysis when no PKGViz parser exists for the selected language. */
function assertSupportedLanguage(language: Language): void {
  if (
    ![
      Language.Java,
      Language.TypeScript,
      Language.Cpp,
      Language.Python,
      Language.Delphi,
      Language.Kotlin,
    ].includes(language)
  ) {
    throw new Error(
      "Supported language is 'Java', 'TypeScript', 'C++', 'Python', 'Delphi' & 'Kotlin'. More to follow."
    );
  }
}

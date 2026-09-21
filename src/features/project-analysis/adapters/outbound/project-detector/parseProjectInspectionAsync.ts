import path from 'node:path';

import type { ProjectInspection } from '@ankhorage/project-detector/types';
import { resolveFileSystemPathWithinRoot } from '@ankhorage/utility/node/fs';

import { parseCppFile } from '@/app/utils/parser/cpp/parseCppFile';
import { parseDelphiFile } from '@/app/utils/parser/delphi/parseFile';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseKotlinFile } from '@/app/utils/parser/kotlin/parseFile';
import { parsePythonFile } from '@/app/utils/parser/python/parseFile';
import { parseFile as parseTypeScriptFile } from '@/app/utils/parser/typescript/parseFile';
import { analyzeDependencyImportsAsync } from '@/features/dependency-analysis/adapters/outbound/dependency-graph/analyzeDependencyImportsAsync';
import { type ImportDefinition, Language, type ParsedDirectory, type ParsedFile } from '@/shared/types';

interface ParseSourceInput {
  readonly analysisRootPath: string;
  readonly imports: readonly ImportDefinition[];
  readonly language: Language;
  readonly projectPath: string;
  readonly relativeFile: string;
  readonly sourceFile: string;
}

/*** Project the canonical inspection inventory into PKGViz's parsed tree. */
export async function parseProjectInspectionAsync(
  inspection: ProjectInspection,
  language: Language,
  projectPath: string
): Promise<ParsedDirectory> {
  assertSupportedLanguage(language);

  const analysisRoot = analysisRootFor(inspection, language);
  const analysisRootPath = resolveFileSystemPathWithinRoot(projectPath, analysisRoot, {
    allowRoot: true,
  });
  const importsByFile = await importsForLanguageAsync(language, projectPath, analysisRootPath);
  const result: ParsedDirectory = Object.create(null);

  for (const directory of inspection.directories) {
    const relativeDirectory = relativeToAnalysisRoot(directory, analysisRoot);
    if (relativeDirectory === undefined || relativeDirectory === '') continue;
    ensureDirectory(result, relativeDirectory);
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
      relativeFile,
      sourceFile,
    });
    insertFile(result, relativeFile, parsedFile);
  }

  return result;
}

/*** Preserve the established PKGViz tree root while consuming detector-owned source-root evidence. */
function analysisRootFor(inspection: ProjectInspection, language: Language): string {
  if (language === Language.TypeScript) return '.';
  return (
    inspection.detection.languages.find(candidate => candidate.id === language)?.sourceRoots[0] ??
    '.'
  );
}

/*** Convert one project-relative inventory path to the selected analysis-root-relative path. */
function relativeToAnalysisRoot(inventoryPath: string, analysisRoot: string): string | undefined {
  if (analysisRoot === '.') return inventoryPath;
  if (inventoryPath === analysisRoot) return '';
  const prefix = `${analysisRoot}/`;
  return inventoryPath.startsWith(prefix) ? inventoryPath.slice(prefix.length) : undefined;
}

/*** Create every directory segment with null prototypes so arbitrary project names remain data. */
function ensureDirectory(root: ParsedDirectory, relativeDirectory: string): ParsedDirectory {
  let current = root;
  for (const segment of relativeDirectory.split('/').filter(Boolean)) {
    const existing = current[segment];
    if (existing === undefined) {
      const directory: ParsedDirectory = Object.create(null);
      current[segment] = directory;
      current = directory;
    } else {
      current = existing as ParsedDirectory;
    }
  }
  return current;
}

/*** Insert one parsed file beneath its already inventoried relative parent directory. */
function insertFile(root: ParsedDirectory, relativeFile: string, parsedFile: ParsedFile): void {
  const segments = relativeFile.split('/');
  const fileName = segments.pop();
  if (fileName === undefined) return;
  const parent = ensureDirectory(root, segments.join('/'));
  parent[fileName] = parsedFile;
}

/*** Return import evidence using the existing PKGViz presentation semantics per parser. */
async function importsForLanguageAsync(
  language: Language,
  projectPath: string,
  analysisRootPath: string
): Promise<ReadonlyMap<string, readonly ImportDefinition[]>> {
  switch (language) {
    case Language.TypeScript:
      return analyzeDependencyImportsAsync(projectPath);
    case Language.Java:
    case Language.Cpp:
      return analyzeDependencyImportsAsync(projectPath, analysisRootPath, 'specifier');
    case Language.Kotlin:
      return analyzeDependencyImportsAsync(
        projectPath,
        analysisRootPath,
        'specifier',
        'kotlin-standard-library'
      );
    case Language.Python:
      return analyzeDependencyImportsAsync(projectPath, analysisRootPath, 'specifier', 'python-legacy');
    case Language.Delphi:
      return analyzeDependencyImportsAsync(
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

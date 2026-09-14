import type { ProjectDetection } from '@ankhorage/project-detector/types';
import { Language } from '../../shared/types';
import type { ParserSelection } from '../../types/parserSelection';

/** Select a supported parser by evidence strength, evidence count, then stable parser order. */
export function selectParserLanguage(detection: ProjectDetection): ParserSelection {
  const supported = [
    Language.TypeScript,
    Language.Java,
    Language.Cpp,
    Language.Python,
    Language.Delphi,
    Language.Kotlin,
  ];
  const candidates = supported
    .flatMap(language => {
      const detected = detection.languages.find(candidate => candidate.id === language);
      return detected ? [{ language, detected }] : [];
    })
    .sort(
      (left, right) =>
        right.detected.score - left.detected.score ||
        right.detected.evidence.length - left.detected.evidence.length ||
        supported.indexOf(left.language) - supported.indexOf(right.language)
    );
  const selected = candidates[0];
  if (!selected) {
    throw new Error(
      `No supported parser detected. Found: ${detection.languages.map(language => language.id).join(', ') || 'unknown'}. Supported: ${supported.join(', ')}.`
    );
  }
  return {
    language: selected.language,
    score: selected.detected.score,
    indicators: selected.detected.evidence,
    candidates: detection.languages,
  };
}

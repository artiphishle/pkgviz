import { Language } from '@/shared/types';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { expect } from '@artiphishle/testosterone/src/matchers';
import { detectLanguage, isJavaRoot, isTypeScriptRoot } from '@/shared/utils/detectLanguage';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('[detectLanguage]', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'monorepo-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('detects Java as the correct project language in a monorepo', async () => {
    const javaAppPath = path.join(tempDir, 'apps', 'java-app');
    fs.mkdirSync(javaAppPath, { recursive: true });
    fs.writeFileSync(path.join(javaAppPath, 'pom.xml'), '<project></project>');

    const { confidence, indicators, language } = await detectLanguage(tempDir);
    expect(indicators).toContain('pom.xml');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.Java);
  });

  it('detects TypeScript as the correct project language in a monorepo', async () => {
    const tsAppPath = path.join(tempDir, 'packages', 'ts-app');
    fs.mkdirSync(tsAppPath, { recursive: true });
    fs.writeFileSync(path.join(tsAppPath, 'tsconfig.base.json'), '{}');
    fs.writeFileSync(path.join(tsAppPath, 'package.json'), '{}');


    const { confidence, indicators, language } = await detectLanguage(tempDir);
    expect(indicators).toContain('tsconfig.base.json');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.TypeScript);
  });

  it('detects JavaScript as the correct project language with node_modules', async () => {
    const jsAppPath = path.join(tempDir, 'apps', 'js-app');
    fs.mkdirSync(jsAppPath, { recursive: true });
    fs.mkdirSync(path.join(jsAppPath, 'node_modules'), { recursive: true });
    fs.writeFileSync(path.join(jsAppPath, 'package.json'), '{}');

    const { confidence, indicators, language } = await detectLanguage(tempDir);
    expect(indicators).toContain('node_modules directory');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.JavaScript);
  });

  it('detects Python as the correct project language with venv', async () => {
    const pythonAppPath = path.join(tempDir, 'apps', 'python-app');
    fs.mkdirSync(pythonAppPath, { recursive: true });
    fs.mkdirSync(path.join(pythonAppPath, 'venv'), { recursive: true });
    fs.writeFileSync(path.join(pythonAppPath, 'requirements.txt'), 'flask');

    const { confidence, indicators, language } = await detectLanguage(tempDir);
    expect(indicators).toContain('virtual environment');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.Python);
  });

  it('detects Java as the correct project language with .mvn', async () => {
    const javaAppPath = path.join(tempDir, 'apps', 'java-app');
    fs.mkdirSync(javaAppPath, { recursive: true });
    fs.mkdirSync(path.join(javaAppPath, '.mvn'), { recursive: true });
    fs.writeFileSync(path.join(javaAppPath, 'pom.xml'), '<project></project>');

    const { confidence, indicators, language } = await detectLanguage(tempDir);
    expect(indicators).toContain('Maven wrapper');
    expect(confidence).toBe(1);
    expect(language).toBe(Language.Java);
  });
});

describe('[isJavaRoot]', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'java-root-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('recognizes a Java root by its pom.xml', async () => {
    fs.writeFileSync(path.join(tempDir, 'pom.xml'), '<project></project>');
    expect(await isJavaRoot(tempDir)).toBe(true);
  });
});

describe('[isTypeScriptRoot]', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ts-root-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('recognizes a TypeScript root by its tsconfig.json', async () => {
    fs.writeFileSync(path.join(tempDir, 'tsconfig.json'), '{}');
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
    expect(await isTypeScriptRoot(tempDir)).toBe(true);
  });

  it('recognizes a TypeScript root by its tsconfig.base.json', async () => {
    fs.writeFileSync(path.join(tempDir, 'tsconfig.base.json'), '{}');
    fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');
    expect(await isTypeScriptRoot(tempDir)).toBe(true);
  });
});

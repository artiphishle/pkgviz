import { Language } from '@/types/language';
import type { ProjectFileMetadata } from '@/types/projectFiles';

import { beforeEach } from 'node:test';
import { describe, expect, it, resolve } from '@artiphishle/testosterone';
import { getAuditAction } from '@/app/actions/audit.actions';

describe('[getAuditAction]', () => {
  beforeEach(() => {
    // keep tests deterministic; set path fresh for each test
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
  });

  // Test: Audit output contains 'App.java' which is matched correctly, also audit.meta is correct
  it('generates correct Audit (App.java & meta property)', async () => {
    const audit = await getAuditAction();

    const appJava = {
      className: 'App',
      imports: [
        {
          isIntrinsic: true,
          name: 'com.example.myapp.a.A',
          pkg: 'com.example.myapp.a',
        },
      ],
      package: 'com.example.myapp',
      path: 'com/example/myapp/App.java',
    };

    // any ok. Avoid cyclic type: Java package nesting can contain unknown length of sub packages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditAppJava = (audit.files.com as any).example.myapp['App.java'] as ProjectFileMetadata;

    // audit.files > File 'App.java'
    expect(auditAppJava.className).toBe(appJava.className);

    expect(auditAppJava.imports[0].isIntrinsic).toBe(appJava.imports[0].isIntrinsic);
    expect(auditAppJava.imports[0].name).toBe(appJava.imports[0].name);
    expect(auditAppJava.imports[0].pkg).toBe(appJava.imports[0].pkg);

    expect(auditAppJava.package).toBe(appJava.package);
    expect(auditAppJava.path).toBe(appJava.path);

    // audit.meta
    expect(audit.meta.language.language).toBe(Language.Java);
    expect(audit.meta.projectName).toBe('my-app');
    expect(typeof audit.meta.timeStart).toBe('number');
    expect(typeof audit.meta.timeEnd).toBe('number');

    const cyclicRule = audit.evaluation.rules.find(rule => rule.id === 'cyclic-dependencies');
    expect(cyclicRule?.status).toBe('failed');
    expect(cyclicRule?.policy).toBe('blocking');
    expect(audit.evaluation.cyclicPackages.length).toBe(1);
    expect(JSON.stringify(cyclicRule?.evidence).includes('com.example.myapp.a')).toBe(true);
  });
});

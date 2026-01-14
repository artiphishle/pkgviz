import { beforeEach,describe,expect,it,resolve, } from '@artiphishle/testosterone';
import { Language, type ParsedFile } from '@/shared/types';

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
      calls: [
        {
          callee: 'out',
          method: 'println',
        },
      ],
      className: 'App',
      imports: [
        {
          isIntrinsic: true,
          name: 'com.example.myapp.a.A',
          pkg: 'com.example.myapp.a',
        },
      ],
      methods: [
        {
          name: 'main',
          parameters: ['String[] args'],
          returnType: 'void',
          visibility: 'public',
        },
      ],
      package: 'com.example.myapp',
      path: 'com/example/myapp/App.java',
    };

    // any ok. Avoid cyclic type: Java package nesting can contain unknown length of sub packages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditAppJava = (audit.files.com as any).example.myapp['App.java'] as ParsedFile;

    // audit.files > File 'App.java'
    expect(auditAppJava.className).toBe(appJava.className);

    expect(auditAppJava.calls[0].callee).toBe(appJava.calls[0].callee);
    expect(auditAppJava.calls[0].method).toBe(appJava.calls[0].method);

    expect(auditAppJava.imports[0].isIntrinsic).toBe(appJava.imports[0].isIntrinsic);
    expect(auditAppJava.imports[0].name).toBe(appJava.imports[0].name);
    expect(auditAppJava.imports[0].pkg).toBe(appJava.imports[0].pkg);

    expect(auditAppJava.methods[0].name).toBe(appJava.methods[0].name);
    expect(auditAppJava.methods[0].parameters[0]).toBe(appJava.methods[0].parameters[0]);
    expect(auditAppJava.methods[0].returnType).toBe(appJava.methods[0].returnType);
    expect(auditAppJava.methods[0].visibility).toBe(
      appJava.methods[0].visibility as 'public' | 'private' | 'protected'
    );

    expect(auditAppJava.package).toBe(appJava.package);
    expect(auditAppJava.path).toBe(appJava.path);

    // audit.meta
    expect(audit.meta.language.language).toBe(Language.Java);
    expect(audit.meta.projectName).toBe('my-app');
    expect(typeof audit.meta.timeStart).toBe('number');
    expect(typeof audit.meta.timeEnd).toBe('number');
  });
});

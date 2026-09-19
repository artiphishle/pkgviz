import { assert, describe, expect, it, resolve } from '@artiphishle/testosterone';
import { parseJavaFile } from '@/app/utils/parser/java/parseJavaFile';
import { parseProjectPath } from '@/shared/utils/parseProjectPath';

describe('[parseJavaFile]', () => {
  it('parses a .java file correctly', async () => {
    process.env.NEXT_PUBLIC_PROJECT_PATH = resolve(process.cwd(), 'examples/java/my-app');
    const projectPath = parseProjectPath();
    const javaFile = resolve(projectPath, 'src/main/java/com/example/myapp/App.java');
    const parsedJavaFile = await parseJavaFile(javaFile, projectPath, [
      {
        name: 'com.example.myapp.a.A',
        pkg: 'com.example.myapp.a',
        isIntrinsic: true,
      },
    ]);

    expect(parsedJavaFile.className).toBe('App');
    expect(parsedJavaFile.imports.length).toBe(1);
    expect(parsedJavaFile.methods.length).toBe(1);
    expect(parsedJavaFile.package).toBe('com.example.myapp');
    expect(parsedJavaFile.path).toBe('src/main/java/com/example/myapp/App.java');
  });

  it('rejects file reads outside the selected project root', async () => {
    const projectPath = resolve(process.cwd(), 'examples/java/my-app');

    await assert.rejects(
      parseJavaFile(resolve(projectPath, '..', 'outside.java'), projectPath, []),
      /Path escaped the allowed root/
    );
  });
});

import { assert, describe, it } from '@artiphishle/testosterone';

import { parsePkgvizCliArgs } from '@/cli/parsePkgvizCliArgs';

describe('[parsePkgvizCliArgs]', () => {
  it('returns the existing audit defaults', () => {
    assert.deepEqual(parsePkgvizCliArgs(['bun', 'pkgviz']), {
      out: 'audit.json',
      open: false,
      serve: false,
      prod: false,
      waitMs: 90_000,
      pretty: true,
      verbose: false,
      failOnRuleViolation: true,
      help: false,
      rules: [],
    });
  });

  it('parses viewer, output, and repeated audit policy options', () => {
    assert.deepEqual(
      parsePkgvizCliArgs([
        'bun',
        'pkgviz',
        '--out',
        'reports/audit.json',
        '--open',
        '--serve',
        '--prod',
        '--port',
        '4040',
        '--wait',
        '12000',
        '--no-pretty',
        '--rule',
        'cyclic-dependencies=audit',
        '--rule',
        'cyclic-dependencies=off',
        '--no-fail-on-rule-violation',
        '--verbose',
      ]),
      {
        out: 'reports/audit.json',
        open: true,
        serve: true,
        prod: true,
        port: 4040,
        waitMs: 12_000,
        pretty: false,
        verbose: true,
        failOnRuleViolation: false,
        help: false,
        rules: [
          { id: 'cyclic-dependencies', mode: 'audit' },
          { id: 'cyclic-dependencies', mode: 'off' },
        ],
      }
    );
  });

  it('recognizes help without performing process I/O', () => {
    assert.equal(parsePkgvizCliArgs(['bun', 'pkgviz', '--help']).help, true);
  });

  it('rejects malformed or unknown audit rule overrides', () => {
    assert.throws(
      () => parsePkgvizCliArgs(['bun', 'pkgviz', '--rule', 'cyclic-dependencies=warn']),
      /Invalid mode/
    );
    assert.throws(
      () => parsePkgvizCliArgs(['bun', 'pkgviz', '--rule', 'unknown=block']),
      /Unknown audit rule/
    );
    assert.throws(
      () => parsePkgvizCliArgs(['bun', 'pkgviz', '--rule']),
      /--rule requires a value/
    );
  });
});

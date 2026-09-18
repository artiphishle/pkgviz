# PKGViz Maven Plugin

Thin Maven adapter for the shared PKGViz audit and rule engine.

The plugin does not implement dependency analysis or audit rules in Java. It invokes the published
PKGViz CLI and maps the shared exit contract into Maven build semantics.

## Goal

`pkgviz:audit` runs during `verify` by default.

- exit code `0`: all blocking rules passed
- exit code `2`: a blocking audit rule failed; Maven fails with `MojoFailureException`
- other non-zero exit codes: audit execution/configuration failure
- the audit is written to `target/pkgviz-audit.json` before a rule failure is raised

## Configuration

By default the plugin runs:

```text
npx --yes pkgviz --out target/pkgviz-audit.json
```

For reproducible CI, pin `pkgviz.packageSpec` to the PKGViz release your pipeline expects.

```xml
<plugin>
  <groupId>io.github.artiphishle</groupId>
  <artifactId>pkgviz-maven-plugin</artifactId>
  <version>0.1.0-SNAPSHOT</version>
  <executions>
    <execution>
      <goals>
        <goal>audit</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <packageSpec>pkgviz@YOUR_VERSION</packageSpec>
  </configuration>
</plugin>
```

`pkgviz.executable`, `pkgviz.packageSpec`, `pkgviz.output`, `pkgviz.cli`, and
`pkgviz.skip` are configurable Maven properties.

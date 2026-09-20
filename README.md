![issues](https://img.shields.io/github/issues/artiphishle/pkgviz?style=flat-square)
![PRs](https://img.shields.io/github/issues-pr/artiphishle/pkgviz?style=flat-square)

# Package Visualizer

Tool to visualize packages and their dependencies between each other. This project is inspired by [socomo](https://github.com/gdela/socomo).

Good software architecture starts with matching functional requirements to code structure.
Visualizing and showing the dependencies of packages in your project is the first step to regain control of your project.

Supported and auto-selected parsers:

- C++
- Delphi
- Java
- Kotlin
- TypeScript
- Python

## Prerequisites

Make sure to have Bun and Node.js 24 or newer installed; check `package.json` for allowed versions.

## Project detection

Project inspection is provided by `@ankhorage/project-detector`, including nested source files,
package metadata, and polyglot evidence. Dependency/build directories and pkgviz's excluded
example/test directories are pruned. Incomplete inspections fail explicitly rather than selecting
a parser from partial results.

pkgviz owns parser selection: strongest language evidence first, then the number of evidence paths,
then the stable order TypeScript, Java, C++, Python, Delphi, Kotlin. All detected language candidates
remain available in audit metadata. This selects one parser; it does not parse every language in a
polyglot repository. Choose the relevant project directory when auditing separate applications.
JavaScript can be detected, but pkgviz does not currently provide a JavaScript parser.

Audit consumers: `meta.language.confidence` has been replaced by `score` (heuristic strength,
not a probability) and `candidates`. `language` and `indicators` remain available; indicators now
contain detector evidence paths. Parser-specific source-root resolution remains owned by pkgviz.

## Quickstart

### BUNX

The `bunx` script will create a `audit.json` in your project root:

```bash
# Run from the project root you want to analyze
bunx pkgviz

```

### Maven

The Maven adapter runs the same PKGViz audit/rule contract during `verify` and writes
`target/pkgviz-audit.json`.

For local development of the plugin itself:

```bash
mvn -B -f maven-plugin/pom.xml install
```

Then configure the plugin in the Maven project being audited:

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
    <rules>
      <rule>cyclic-dependencies=block</rule>
    </rules>
    <failOnRuleViolation>true</failOnRuleViolation>
  </configuration>
</plugin>
```

Use `audit` instead of `block` to record cyclic dependencies without failing the build, or
`off` to disable that rule. Set `failOnRuleViolation=false` to keep blocking findings in the
audit while keeping the Maven build green.

See [maven-plugin/README.md](./maven-plugin/README.md) for the complete Maven configuration.

### GitHub Actions

PKGViz ships a reusable GitHub Actions workflow that always attempts to upload
`pkgviz-audit.json` as the `pkgviz-audit` artifact, including when a blocking rule fails.

```yaml
jobs:
  pkgviz-audit:
    uses: artiphishle/pkgviz/.github/workflows/pkgviz-audit.yml@vX.Y.Z
    with:
      pkgviz_version: X.Y.Z
      cyclic_dependencies: block
      fail_on_rule_violation: true
```

Pin both the workflow ref and `pkgviz_version` to a released version for reproducible CI.

Common policies:

```yaml
# Finding is written to the artifact and fails CI.
cyclic_dependencies: block
fail_on_rule_violation: true
```

```yaml
# Finding is written as advisory; CI stays green.
cyclic_dependencies: audit
fail_on_rule_violation: true
```

```yaml
# Rule stays blocking in the audit, but this CI run never fails only because of audit findings.
cyclic_dependencies: block
fail_on_rule_violation: false
```

```yaml
# Rule is disabled.
cyclic_dependencies: off
```

### Browser Visualization

To show the graph visualization in the browser:

```bash
# 1. Install dependencies
bun install

# 2. Create your .env file
cp .env.tpl .env

# 3. Supply the project path to analyze in the .env file

# 4. Run the app
bun dev
```

## Performance

Graph rendering follows the applicable [Cytoscape performance guidance](https://js.cytoscape.org/#performance).
PKGViz owns package projection and presentation; ZORA GraphView owns the renderer, layout lifecycle,
and viewport workflow. A topology change must produce a correctly framed graph through that workflow,
not additional component effects. Source changes are not evidence of browser responsiveness.

| Priority | Recommendation / responsibility | Owner | Status and evidence |
| --- | --- | --- | --- |
| P0 | Avoid repeated full-graph searches | PKGViz | Implemented: package-ancestor and cycle-overlay indexes replace per-element scans. CPU measurements below. |
| P0 | Avoid unnecessary element replacement and layout work | ZORA | [PR #491](https://github.com/ankhorage/zora/pull/491) tested, not yet released or integrated. Presentation-only updates must preserve viewport and selection. |
| P0 | Settle obsolete layouts safely and release resources | ZORA | PR #491 isolates asynchronous ELK completion. ELK computation itself remains uncancellable; browser workload acceptance is pending. |
| P1 | Batch graph mutations and use ID lookup | ZORA | Current artifact batches updates and uses ID lookup for targeted selection/focus. Full replacement remains until #491 is consumed. |
| P1 | Replace function-valued styles with data mappings | PKGViz | Implemented: label and width use prepared presentation data. Headless regression coverage preserves dimensions and cycle styling. |
| P1 | Avoid layout animation overhead | ZORA | Current GraphView forces non-animated layouts; PKGViz layout-option values do not override that owner policy. |
| P1 | Keep ordinary edges opaque and labels limited | PKGViz | Existing baseline: solid opaque edges; ordinary edges have no labels. Cycle-step labels and directed arrows retain their meaning. |
| P1 | Bound displayed graph size | PKGViz | Existing package/depth/vendor projection; lifted edge weights remain covered by regression tests. |
| P1 | Resolve overlap warnings | Shared | Still open: compound/ancestor-edge handling is tested at model/style boundaries, not proven warning-free in the browser. |
| P2 | Reduce label detail, pixel density, edge routing cost or compound content | Shared | Proposal only: requires measured benefit and user agreement on visual tradeoffs. No quality-reducing defaults enabled. |
| P2 | Share graph/audit project analysis | PKGViz | Source review found separate initial analysis calls. Proposal only; snapshot freshness and failure behavior need an explicit design. |

### Presentation CPU measurement

Measured improvements on the local synthetic benchmark below:

- **About 80 times faster graph-model preparation:** 294.5 ms down to 3.7 ms without cycle
  overlays, removing about 291 ms of CPU work from each measured model update.
- **About 86 times faster with 50 cycle overlays:** 342.6 ms down to 4.0 ms, while preserving
  cycle-color precedence and directed-edge step numbering.

These gains reduce the work needed to prepare graph updates without removing graph details.
They describe model preparation only, not the speed of the entire application or browser renderer.

Run `bun test/benchmarks/graphPresentation.ts`. The synthetic fixture contains 5,251 package nodes,
15,000 directed edges, and an optional 50 cycle overlays. Each result is the median of nine samples
after three warmups, on the same machine/runtime (macOS arm64, Bun 1.4.2).

| Operation | Before (`5496a87`) | Indexed presentation |
| --- | ---: | ---: |
| Model, no cycle overlays | 294.5 ms | 3.7 ms |
| Model, 50 cycle overlays | 342.6 ms | 4.0 ms |
| Package/depth projection (unchanged) | 6.4 ms | 6.2 ms |

These are local CPU microbenchmarks, not browser frame-rate, layout, memory, network, or end-to-end
measurements. Timings vary; there is no timing threshold in the regression suite. Update this table
when owner fixes are released/integrated or measurements change. Further optimization candidates
must be reported before implementation. E2E and smoke tests are currently excluded by agreement.

## Documentation

Find the official documentation at Github Pages here:

[artiphishle.github.io/pkgviz-docs](https://artiphishle.github.io/pkgviz-docs/)

## Just get the analysis

Run `bunx pkgviz` from any project root (Java & TypeScript, more to follow) and a `audit.json` will be generated for you.

## Test

```bash
# Run tests
bun run test

# Print Coverage to stdout
bun run test:cov

# Generate HTML Coverage to 'test/coverage/index.html'
bun test:cov:html
```

## Contributing

The list of open source tools to visualize code structure is rather short. Structure101 is now part of Sonar. Don't let paid tools dominate software craft. Join us and contribute to open-source!

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

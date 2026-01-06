![issues](https://img.shields.io/github/issues/artiphishle/pkgviz?style=flat-square)
![PRs](https://img.shields.io/github/issues-pr/artiphishle/pkgviz?style=flat-square)

# Package Visualizer

Tool to visualize packages and their dependencies between each other. This project is inspired by [socomo](https://github.com/gdela/socomo).

Good software architecture starts with matching functional requirements to code structure.
Visualizing and showing the dependencies of packages in your project is the first step to regain control of your project.

Supported and auto-detected projectlanguages:

- C++
- Delphi
- Java
- JavaScript
- Kotlin
- TypeScript
- Python

## Prerequisites

Make sure to have Bun & Node installed, check `package.json` for allowed versions

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

[artiphishle.github.io/forensics-docs](https://artiphishle.github.io/forensics-docs/)

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

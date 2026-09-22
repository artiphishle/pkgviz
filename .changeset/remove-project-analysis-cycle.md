---
'pkgviz': patch
---

Move project snapshot orchestration into the project-analysis composition boundary so outbound filesystem adapters no longer depend on composition and the project-analysis source graph is acyclic.

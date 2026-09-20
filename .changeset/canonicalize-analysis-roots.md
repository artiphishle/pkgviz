---
'pkgviz': patch
---

Preserve import and cycle evidence when project or source roots resolve through symbolic links by canonicalizing both paths through the safe filesystem API and rejecting analysis roots outside the selected project.

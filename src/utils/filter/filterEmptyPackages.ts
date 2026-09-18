import type { ElementsDefinition } from 'cytoscape';

/**
 * Returns root package if only one inside, or '' (root folder)
 */
function getRootPackage(elements: ElementsDefinition) {
  const rootPackages = elements.nodes.filter(n => {
    return !n.data.id?.includes('.');
  });
  return rootPackages.length > 1 ? '' : rootPackages[0].data.id!;
}

/**
 * Filter empty packages from graph (skip to next interesting package)
 */
export function filterEmptyPackages(currentPackage: string, elements: ElementsDefinition): string {
  const nodes = elements.nodes.map(n => n.data.id!); // Non-null assertion

  if (!currentPackage) return getRootPackage(elements);

  while (true) {
    const childPackages = nodes.filter(
      id =>
        id.startsWith(currentPackage + '.') &&
        id.split('.').length === currentPackage.split('.').length + 1
    );

    if (childPackages.length === 1) {
      currentPackage = childPackages[0];
    } else {
      break;
    }
  }

  return currentPackage;
}

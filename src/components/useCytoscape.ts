'use client';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { getStyle as getCommonStyle, getCanvasBg } from '@/themes/style';
import {
  getBreadthfirstStyle,
  getCircleStyle,
  getConcentricStyle,
  getGridStyle,
  getKlayStyle,
} from '@/themes/index';

import cytoscape, {
  Core,
  LayoutOptions,
  type ElementsDefinition,
  type NodeDataDefinition,
  type NodeDefinition,
} from 'cytoscape';
import { useSettings } from '@/contexts/SettingsContext';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
// import { filterSubPackages } from '@/utils/filter/filterSubPackages';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { hasChildren } from '@/utils/hasChildren';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';
import { LAYOUTS } from '@/themes/constants';
import { filterSubPackagesByDepth, getMaxDepth } from '@/utils/filter/filterSubPackagesFromDepth';

export function useCytoscape(
  elements: ElementsDefinition | null,
  currentPackage: string,
  setCurrentPackage: (path: string) => void
) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);
  const {
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    showSubPackages,
    showVendorPackages,
    subPackageDepth,
    setMaxSubPackageDepth,
  } = useSettings();

  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme === 'dark' ? 'dark' : 'light') as 'dark' | 'light';

  useEffect(() => {
    if (!elements) return;

    const afterPkgFilter = filterByPackagePrefix(elements, currentPackage.replace(/\//g, '.'));
    const afterSubPkgFilter = showSubPackages
      ? afterPkgFilter
      : filterSubPackagesByDepth(afterPkgFilter, false, subPackageDepth);
    // const afterSubPkgFilter = showSubPackages ? afterPkgFilter : filterSubPackages(afterPkgFilter);
    const afterVendorPkgFilter = showVendorPackages
      ? afterSubPkgFilter
      : filterVendorPackages(afterSubPkgFilter);

    const nonEmptyCurrentPackage = filterEmptyPackages(currentPackage, afterVendorPkgFilter);
    if (nonEmptyCurrentPackage !== currentPackage) {
      setCurrentPackage(nonEmptyCurrentPackage);
      return;
    }

    const finalElements: ElementsDefinition = {
      nodes: afterVendorPkgFilter.nodes.map(node => {
        const label = !currentPackage.length
          ? node.data.id
          : node.data.id?.slice(currentPackage.length + 1);
        return {
          group: 'nodes',
          classes: node.classes || '',
          data: { ...node.data, label },
        } as NodeDefinition;
      }),
      edges: afterVendorPkgFilter.edges,
    };

    console.log(finalElements);

    setFilteredElements(finalElements);
    setMaxSubPackageDepth(getMaxDepth(elements));
  }, [
    elements,
    currentPackage,
    setCurrentPackage,
    showSubPackages,
    showVendorPackages,
    subPackageDepth,
    setMaxSubPackageDepth,
  ]);

  // Init Cytoscape
  useEffect(() => {
    if (!cyRef.current || !elements || !filteredElements) return;

    const getLayoutStyle =
      cytoscapeLayout === 'breadthfirst'
        ? getBreadthfirstStyle
        : cytoscapeLayout === 'circle'
          ? getCircleStyle
          : cytoscapeLayout === 'grid'
            ? getGridStyle
            : cytoscapeLayout === 'klay'
              ? getKlayStyle
              : getConcentricStyle;

    const cy = cytoscape({
      layout: {
        ...LAYOUTS[cytoscapeLayout as LayoutOptions['name']],
        spacingFactor: cytoscapeLayoutSpacing,
      } as LayoutOptions,
      style: [...getLayoutStyle(), ...getCommonStyle(filteredElements, theme)],
      container: cyRef.current,
      elements: filteredElements,
      selectionType: 'additive',
      userPanningEnabled: true,
      minZoom: 0.01,
      maxZoom: 2,
    });

    setCyInstance(cy);
    cyRef.current.style.background = getCanvasBg(theme);

    const updateHighlights = () => {
      const selectedNodes = cy.nodes(':selected');
      const all = cy.elements();
      all.removeClass('hushed highlight highlight-outgoer highlight-incomer');
      if (selectedNodes.empty()) return;
      const keep = selectedNodes.union(selectedNodes.neighborhood());
      all.difference(keep).addClass('hushed');
      selectedNodes.addClass('highlight');
      selectedNodes.outgoers().addClass('highlight-outgoer');
      selectedNodes.incomers().addClass('highlight-incomer');
    };

    cy.on('select unselect', 'node', updateHighlights);

    cy.ready(() => {
      cy.nodes()
        .filter(node => !!(node.data as NodeDataDefinition).isParent)
        .addClass('isParent');
    });

    cy.on('mouseover', 'node', event => {
      const node = event.target;
      const rawNode = filteredElements.nodes.find(
        elm => elm.data.id === node.data().id
      ) as NodeDefinition;
      if (hasChildren(rawNode, elements.nodes)) document.body.style.cursor = 'pointer';

      cy.elements()
        .subtract(node.outgoers())
        .subtract(node.incomers())
        .subtract(node)
        .addClass('hushed');
      node.addClass('highlight');
      node.outgoers().addClass('highlight-outgoer');
      node.incomers().addClass('highlight-incomer');
    });

    cy.on('mouseout', 'node', () => {
      document.body.style.cursor = 'default';
      updateHighlights();
    });

    let highlightDelay: ReturnType<typeof setTimeout>;
    cy.on('mouseover', 'edge', e => {
      const edge = e.target;
      edge.addClass('highlight-dependency');
      highlightDelay = setTimeout(() => {
        edge.source().addClass('highlight-dependency');
        edge.target().addClass('highlight-dependency');
      }, 150);
    });
    cy.on('mouseout', 'edge', e => {
      const edge = e.target;
      edge.removeClass('highlight-dependency');
      clearTimeout(highlightDelay);
      edge.source().removeClass('highlight-dependency');
      edge.target().removeClass('highlight-dependency');
    });

    cy.nodes().forEach(node => {
      const rawNode = filteredElements.nodes.find(
        elm => elm.data.id === node.data().id
      ) as NodeDefinition;
      if (!hasChildren(rawNode, elements.nodes)) return;
      node.addClass('isParent');
      node.on('dblclick', () => setCurrentPackage(node.id().replace(/\./g, '/')));
    });

    // Fit on resize
    const handleResize = () => cy.fit();
    const observer = new ResizeObserver(() => requestAnimationFrame(handleResize));
    observer.observe(cyRef.current);

    return () => {
      cy.destroy();
      observer.disconnect();
      setCyInstance(null);
    };
  }, [
    elements,
    filteredElements,
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    theme,
    setCurrentPackage,
  ]);

  // Theme live update: Restyle without re-creating the instance
  useEffect(() => {
    if (!cyInstance || !filteredElements || !cyRef.current) return;
    cyInstance.style([...getCommonStyle(filteredElements, theme)]).update();
    cyRef.current.style.background = getCanvasBg(theme);
  }, [cyInstance, filteredElements, theme]);

  return { cyRef, cyInstance };
}

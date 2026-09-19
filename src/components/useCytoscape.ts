'use client';
import type { Core, LayoutOptions } from 'cytoscape';
import cytoscape, { type ElementsDefinition, type Layouts } from 'cytoscape';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useSettings } from '@/contexts/SettingsContext';
import {
  getBreadthfirstStyle,
  getCircleStyle,
  getConcentricStyle,
  getElkStyle,
  getGridStyle,
} from '@/layouts';
import { LAYOUTS } from '@/layouts/constants';
import { getCanvasBg, getStyle as getCommonStyle } from '@/layouts/style';
import type { CycleHighlight } from '@/types/auditVisualization';
import type { GraphRevealRequest } from '@/types/projectTree';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';
import { filterSubPackagesByDepth, getMaxDepth } from '@/utils/filter/filterSubPackagesFromDepth';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { toggleCompoundNodes } from '@/utils/filter/toggleCompoundNodes';
import { applyCycleHighlights } from '@/utils/graph/applyCycleHighlights';
import { hasChildren } from '@/utils/hasChildren';

/*** Owns the Cytoscape instance, filtering, layout, styling, and interactions. */
export function useCytoscape(
  elements: ElementsDefinition | null,
  currentPackage: string,
  setCurrentPackage: (path: string) => void,
  cycleHighlights: readonly CycleHighlight[],
  graphRevealRequest: GraphRevealRequest | null
) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);

  // Keep the running layout so we can stop it on swap
  const layoutRef = useRef<Layouts | null>(null);
  const graphRevealRequestRef = useRef<GraphRevealRequest | null>(null);

  // Refs for latest data so event handlers don't need to be re-created
  const elementsRef = useRef<ElementsDefinition | null>(null);
  const filteredElementsRef = useRef<ElementsDefinition | null>(null);
  elementsRef.current = elements;
  filteredElementsRef.current = filteredElements;
  graphRevealRequestRef.current = graphRevealRequest;

  const {
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    showCompoundNodes,
    showVendorPackages,
    subPackageDepth,
    setMaxSubPackageDepth,
  } = useSettings();

  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === 'dark' ? 'dark' : 'light';

  /** 1) Compute filteredElements when inputs change */
  useEffect(() => {
    if (!elements) return;

    const afterCompoundNodeFilter = toggleCompoundNodes(
      elements,
      showCompoundNodes,
      currentPackage
    );

    const afterPkgFilter = filterByPackagePrefix(
      afterCompoundNodeFilter,
      currentPackage.replace(/\//g, '.')
    );

    const afterSubPkgFilter = filterSubPackagesByDepth(afterPkgFilter, true, subPackageDepth);

    const afterVendorPkgFilter = showVendorPackages
      ? afterSubPkgFilter
      : filterVendorPackages(afterSubPkgFilter);

    const revealPackage = graphRevealRequestRef.current?.packageId;
    const revealParentPackage =
      revealPackage?.split('.').slice(0, -1).join('.') ?? null;
    const nonEmptyCurrentPackage =
      revealParentPackage === currentPackage
        ? currentPackage
        : filterEmptyPackages(currentPackage, afterVendorPkgFilter);
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
        };
      }),
      edges: afterVendorPkgFilter.edges,
    };

    setFilteredElements(finalElements);
    setMaxSubPackageDepth(getMaxDepth(elements));
  }, [
    elements,
    currentPackage,
    setCurrentPackage,
    showCompoundNodes,
    showVendorPackages,
    subPackageDepth,
    setMaxSubPackageDepth,
  ]);

  /*** 2) Helper for layout options */
  const makeLayoutOpts = useCallback(
    (name: LayoutOptions['name']): LayoutOptions & Record<string, unknown> => ({
      ...LAYOUTS[name],
      spacingFactor: cytoscapeLayoutSpacing,
      nodeDimensionsIncludeLabels: true,
      fit: true,
      animate: false,
      animationDuration: 400,
    }),
    [cytoscapeLayoutSpacing]
  );

  /*** 3) Run (or re-run) layout safely; stop any previous instance */
  const runLayoutSafe = useCallback(
    (cy: Core, name: LayoutOptions['name']) => {
      try {
        layoutRef.current?.stop();
      } catch {
        // Ignore
      }
      layoutRef.current = null;

      if (!cy || cy.destroyed()) return;

      cy.resize();

      requestAnimationFrame(() => {
        if (!cy || cy.destroyed()) return;

        const layout = cy.layout(makeLayoutOpts(name));
        layoutRef.current = layout;

        /*** Fits the graph after the active layout completes. */
        const onStop = () => {
          if (cy.destroyed()) return;
          cy.fit(undefined, 50);
          const revealRequest = graphRevealRequestRef.current;
          if (revealRequest) revealGraphPackage(cy, revealRequest.packageId);
        };
        cy.one('layoutstop', onStop);

        layout.run();
      });
    },
    [makeLayoutOpts]
  );

  /** 4) Init Cytoscape ONCE (data filtering already applied before insertion) */
  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [],
      hideEdgesOnViewport: true,
      minZoom: 0.01,
      maxZoom: 2,
      selectionType: 'additive',
      style: getCommonStyle({ nodes: [], edges: [] }, 'light'),
      userPanningEnabled: true,
    });

    setCyInstance(cy);
    cyRef.current.style.background = getCanvasBg('light');

    /*** Refits the graph after its container is resized. */
    const handleResize = () => {
      if (cy.destroyed()) return;
      cy.fit(undefined, 50);
    };
    const observer = new ResizeObserver(() => requestAnimationFrame(handleResize));
    observer.observe(cyRef.current);

    return () => {
      try {
        layoutRef.current?.stop();
      } catch {
        // Ignore
      }
      layoutRef.current = null;

      observer.disconnect();
      cy.destroy();
      setCyInstance(null);
    };
  }, []);

  /**
   * 5) Data Update
   * - This effect updates the elements and node classes/handlers
   * - It DOES NOT run layout anymore
   * - Layout runs only in effect (6) => avoids double layout runs
   */
  useEffect(() => {
    if (!cyInstance || !filteredElements || cyInstance.destroyed()) return;

    cyInstance.batch(() => {
      cyInstance.elements().remove();
      cyInstance.add(filteredElements);
    });

    // Mark parents + dblclick handler based on latest elementsRef
    cyInstance.nodes().forEach(node => {
      const rawNode = filteredElementsRef.current?.nodes.find(
        elm => elm.data.id === node.data().id
      );

      const allNodes = elementsRef.current?.nodes ?? [];
      node.removeClass('isParent');
      node.off('dblclick');

      if (!rawNode) return;
      if (!hasChildren(rawNode, allNodes)) return;

      node.addClass('isParent');
      node.on('dblclick', () => setCurrentPackage(node.id().replace(/\./g, '/')));
    });
  }, [cyInstance, filteredElements, setCurrentPackage]);

  /**
   * 6) Single Layout Trigger
   *
   * Runs when:
   * - filteredElements changes (new data)
   * - layout name changes
   * - spacing changes
   *
   * - This is now the ONLY place that calls runLayoutSafe
   */
  useEffect(() => {
    if (!cyInstance || !filteredElements || cyInstance.destroyed()) return;
    runLayoutSafe(cyInstance, cytoscapeLayout);
  }, [cyInstance, filteredElements, cytoscapeLayout, cytoscapeLayoutSpacing, runLayoutSafe]);

  /** 7) Applies cycle highlighting without changing graph scope, depth, layout, or zoom. */
  useEffect(() => {
    if (!cyInstance || !filteredElements || cyInstance.destroyed()) return;
    applyCycleHighlights(cyInstance, cycleHighlights);
  }, [cyInstance, filteredElements, cycleHighlights]);

  /** 8) Reveals tree-driven package selection after graph filtering and layout changes. */
  useEffect(() => {
    if (!cyInstance || !filteredElements || !graphRevealRequest || cyInstance.destroyed()) return;
    revealGraphPackage(cyInstance, graphRevealRequest.packageId);
  }, [cyInstance, filteredElements, graphRevealRequest]);

  /** 9) Attach interactive event handlers once (using refs for latest data) */
  useEffect(() => {
    if (!cyInstance) return;
    const cy = cyInstance;

    /*** Updates graph highlighting from the current node selection. */
    const updateHighlights = () => {
      if (cy.destroyed()) return;
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

    cy.on('mouseover', 'node', event => {
      if (cy.destroyed()) return;
      const node = event.target;

      const fe = filteredElementsRef.current;
      const el = elementsRef.current;
      const rawNode = fe?.nodes.find(n => n.data.id === node.data().id);

      if (rawNode && el && hasChildren(rawNode, el.nodes)) {
        document.body.style.cursor = 'pointer';
        if (fe && hasChildren(rawNode, fe.nodes)) return;
      }

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
      if (cy.destroyed()) return;
      document.body.style.cursor = 'default';
      updateHighlights();
    });

    let highlightDelay: ReturnType<typeof setTimeout>;
    cy.on('mouseover', 'edge', e => {
      if (cy.destroyed()) return;
      const edge = e.target;
      edge.addClass('highlight-dependency');
      highlightDelay = setTimeout(() => {
        if (cy.destroyed()) return;
        edge.source().addClass('highlight-dependency');
        edge.target().addClass('highlight-dependency');
      }, 150);
    });

    cy.on('mouseout', 'edge', e => {
      if (cy.destroyed()) return;
      const edge = e.target;
      edge.removeClass('highlight-dependency');
      clearTimeout(highlightDelay);
      edge.source().removeClass('highlight-dependency');
      edge.target().removeClass('highlight-dependency');
    });

    return () => {
      cy.removeAllListeners?.();
      document.body.style.cursor = 'default';
    };
  }, [cyInstance]);

  /** 10) Theme + layout-style live update */
  useEffect(() => {
    if (!cyInstance || !filteredElements || !cyRef.current) return;

    const getLayoutStyle =
      cytoscapeLayout === 'breadthfirst'
        ? getBreadthfirstStyle
        : cytoscapeLayout === 'circle'
          ? getCircleStyle
          : cytoscapeLayout === 'elk'
            ? getElkStyle
            : cytoscapeLayout === 'grid'
              ? getGridStyle
              : getConcentricStyle;

    cyInstance.style([...getCommonStyle(filteredElements, theme), ...getLayoutStyle()]).update();
    cyRef.current.style.background = getCanvasBg(theme);
  }, [cyInstance, filteredElements, theme, cytoscapeLayout]);

  return { cyRef, cyInstance };
}

/*** Selects and fits one visible package node without changing the current graph projection. */
function revealGraphPackage(cy: Core, packageId: string) {
  if (!packageId || cy.destroyed()) return;

  const node = cy.getElementById(packageId);
  if (node.empty()) return;

  cy.nodes().unselect();
  node.select();
  cy.fit(node, 140);
}

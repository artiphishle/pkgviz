'use client';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getStyle as getCommonStyle, getCanvasBg } from '@/layouts/style';
import {
  getBreadthfirstStyle,
  getCircleStyle,
  getConcentricStyle,
  getElkStyle,
  getGridStyle,
} from '@/layouts/index';

import cytoscape, {
  Core,
  LayoutOptions,
  type ElementsDefinition,
  type NodeDefinition,
  type Layouts,
} from 'cytoscape';
import { useSettings } from '@/contexts/SettingsContext';
import { filterByPackagePrefix } from '@/utils/filter/filterByPackagePrefix';
import { filterVendorPackages } from '@/utils/filter/filterVendorPackages';
import { hasChildren } from '@/utils/hasChildren';
import { filterEmptyPackages } from '@/utils/filter/filterEmptyPackages';
import { LAYOUTS } from '@/layouts/constants';
import { filterSubPackagesByDepth, getMaxDepth } from '@/utils/filter/filterSubPackagesFromDepth';
import { toggleCompoundNodes } from '@/utils/filter/toggleCompoundNodes';

export function useCytoscape(
  elements: ElementsDefinition | null,
  currentPackage: string,
  setCurrentPackage: (path: string) => void
) {
  const cyRef = useRef<HTMLDivElement>(null);
  const [filteredElements, setFilteredElements] = useState<ElementsDefinition | null>(null);
  const [cyInstance, setCyInstance] = useState<Core | null>(null);

  // keep the running layout so we can stop it on swap
  const layoutRef = useRef<Layouts | null>(null);

  // refs for latest data so event handlers don't need to be re-created
  const elementsRef = useRef<ElementsDefinition | null>(null);
  const filteredElementsRef = useRef<ElementsDefinition | null>(null);
  elementsRef.current = elements;
  filteredElementsRef.current = filteredElements;

  const {
    cytoscapeLayout,
    cytoscapeLayoutSpacing,
    showCompoundNodes,
    showVendorPackages,
    subPackageDepth,
    setMaxSubPackageDepth,
  } = useSettings();

  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme === 'dark' ? 'dark' : 'light') as 'dark' | 'light';

  /** 1) Compute filteredElements when inputs change */
  useEffect(() => {
    if (!elements) return;

    const afterCompoundNodeFilter = toggleCompoundNodes(elements, showCompoundNodes);
    const afterPkgFilter = filterByPackagePrefix(
      afterCompoundNodeFilter,
      currentPackage.replace(/\//g, '.')
    );
    const afterSubPkgFilter = filterSubPackagesByDepth(afterPkgFilter, true, subPackageDepth);

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

  /** 2) Helper for layout options */
  const makeLayoutOpts = useCallback(
    (name: LayoutOptions['name']): LayoutOptions & { [k: string]: unknown } => ({
      ...LAYOUTS[name],
      spacingFactor: cytoscapeLayoutSpacing,
      nodeDimensionsIncludeLabels: true,
      fit: true,
      animate: false,
      animationDuration: 400,
    }),
    [cytoscapeLayoutSpacing]
  );

  /** 3) run (or re-run) layout safely; stop any previous instance */
  const runLayoutSafe = useCallback(
    (cy: Core, name: LayoutOptions['name']) => {
      // stop previous layout if any
      try {
        layoutRef.current?.stop();
      } catch {
        // ignore
      }
      layoutRef.current = null;

      if (!cy || cy.destroyed()) return;

      cy.resize();

      requestAnimationFrame(() => {
        if (!cy || cy.destroyed()) return;

        const layout = cy.layout(makeLayoutOpts(name));
        layoutRef.current = layout;

        const onStop = () => {
          if (cy.destroyed()) return;
          cy.fit(undefined, 50);
        };
        cy.one('layoutstop', onStop);

        layout.run();
      });
    },
    [makeLayoutOpts]
  );

  // Init Cytoscape ONCE (do not depend on cyInstance / filters / spacing / layout)
  useEffect(() => {
    if (!cyRef.current) return;

    const cy = cytoscape({
      container: cyRef.current,
      elements: [], // we'll add data in a separate effect
      hideEdgesOnViewport: true,
      minZoom: 0.01,
      maxZoom: 2,
      selectionType: 'additive',
      style: getCommonStyle({ nodes: [], edges: [] } as ElementsDefinition, theme),
      userPanningEnabled: true,
    });

    setCyInstance(cy);
    cyRef.current.style.background = getCanvasBg(theme);

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
        // ignore
      }
      layoutRef.current = null;
      observer.disconnect();
      cy.destroy();
      setCyInstance(null);
    };

    // IMPORTANT: we do NOT include cyInstance or settings here, otherwise
    // this effect would loop. We handle updates in other effects.
  }, [theme]); // or [] if you don't care about initial theme here

  /** 5) When data (filteredElements) changes: update graph + rerun layout */
  useEffect(() => {
    if (!cyInstance || !filteredElements || cyInstance.destroyed()) return;

    cyInstance.batch(() => {
      cyInstance.elements().remove();
      cyInstance.add(filteredElements);
    });

    // mark parents + dblclick handler based on latest elementsRef
    cyInstance.nodes().forEach(node => {
      const rawNode = filteredElementsRef.current?.nodes.find(
        elm => elm.data.id === node.data().id
      ) as NodeDefinition | undefined;

      const allNodes = elementsRef.current?.nodes ?? [];
      node.removeClass('isParent');
      node.off('dblclick');

      if (!rawNode) return;
      if (!hasChildren(rawNode, allNodes)) return;

      node.addClass('isParent');
      node.on('dblclick', () => setCurrentPackage(node.id().replace(/\./g, '/')));
    });

    runLayoutSafe(cyInstance, cytoscapeLayout as LayoutOptions['name']);
  }, [cyInstance, filteredElements, cytoscapeLayout, runLayoutSafe, setCurrentPackage]);

  /** 6) If only layout / spacing changes: rerun layout on existing graph */
  useEffect(() => {
    if (!cyInstance || !filteredElements || cyInstance.destroyed()) return;
    runLayoutSafe(cyInstance, cytoscapeLayout as LayoutOptions['name']);
  }, [cyInstance, filteredElements, cytoscapeLayout, cytoscapeLayoutSpacing, runLayoutSafe]);

  /** 7) Attach interactive event handlers once (using refs for latest data) */
  useEffect(() => {
    if (!cyInstance) return;
    const cy = cyInstance;

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
      const rawNode = fe?.nodes.find(elm => elm.data.id === node.data().id) as
        | NodeDefinition
        | undefined;

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

  /** 8) Theme + layout-style live update */
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

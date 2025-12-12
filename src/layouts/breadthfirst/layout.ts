import type { BreadthFirstLayoutOptions } from 'cytoscape';

export const layout: BreadthFirstLayoutOptions = {
  name: 'breadthfirst',

  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled,
  /* animateFilter: function (node: NodeSingular, index: number) {
    return true;
  }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  */
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  circle: false, // put depths in concentric circles if true, put depths top down if false
  depthSort: undefined, // a sorting function to order nodes at equal depth. e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
  direction: 'downward', // determines the direction in which the tree structure is drawn.  The possible values are 'downward', 'upward', 'rightward', or 'leftward'.
  fit: true, // whether to fit the viewport to the graph
  grid: true, // whether to create an even grid into which the DAG is placed (circle:false only)
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  // padding: 30, // padding on fit
  roots: undefined, // the roots of the trees
  // spacingFactor: 1.75, // positive spacing factor, larger => more space between nodes (N.B. n/a if causes overlap)
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) {
    return position;
  }, // transform a given node position. Useful for changing flow direction in discrete layouts
};

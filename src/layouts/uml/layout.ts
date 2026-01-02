import cytoscape, { type Ext, type LayoutOptions } from 'cytoscape';
import cytoscapeCoseBilkent from 'cytoscape-cose-bilkent';
import cytoscapeDomNode from 'cytoscape-cose-bilkent';

export const layout: LayoutOptions = {
  name: 'cose-bilkent',
};

cytoscape.use(cytoscapeCoseBilkent as Ext);
cytoscape.use(cytoscapeDomNode as Ext);

export function cyNodeDef(label, rp) {
  const id = `n${cy.nodes().length}`;
  const div = document.createElement('div');
  div.innerHTML = `node ${id}`;
  div.classList = 'my-cy-node';
  div.style.width = `${Math.floor(Math.random() * 40) + 60}px`;
  div.style.height = `${Math.floor(Math.random() * 30) + 50}px`;

  return {
    data: {
      id: id,
      label: label || `n${cy.nodes().length}`,
      dom: div,
    },
    renderedPosition: rp,
  };
}

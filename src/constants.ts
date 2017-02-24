import {LayoutOptions} from './renderers/IKGraphRenderBackend';

export default {
  STATE_TYPES : ['history','initial','parallel','final','virtual'],
  HIGHLIGHT_ANIM_DURATION : 250,
  ANIM_DURATION : '1500ms',
  LEAF_NODE_PADDING_W : 2.5, 
  LEAF_NODE_PADDING_H : 2.5,
  INITIAL_RADIUS : 4,
  finalStateGradientId : 'finalStateGradient',
  SVGNS : 'http://www.w3.org/2000/svg',
  STROKE_WIDTH : 1,
  ARROW_WIDTH : 3,
  ARROW_HEIGHT : 5,
  HYPERLINK_TYPE : 'hyperlink',
  VIEWBOX_ANIM_ID : 'viewBoxAnimation',
  get beginAnimationId(){
    return `${this.VIEWBOX_ANIM_ID}.beginEvent`;
  },
  layouts : {
    right: (<LayoutOptions>{
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
      labelSpacing : 1,
      layoutHierarchy: true,
      intCoordinates: true,
      edgeRouting: "ORTHOGONAL"
    }),
    auto: (<LayoutOptions>{
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL"
    }),
    layer: (<LayoutOptions>{
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      cycleBreaking: "INTERACTIVE",
      nodeLayering: "INTERACTIVE"
    })/*,
    order: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      crossMin: "INTERACTIVE",
    },
    layerOrder: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      cycleBreaking: "INTERACTIVE",
      nodeLayering: "INTERACTIVE",
      crossMin: "INTERACTIVE",
    }*/
  }
};

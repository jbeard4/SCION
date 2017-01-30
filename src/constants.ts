import {LayoutOptions} from './renderers/IKGraphRenderBackend';

export default {
  STATE_TYPES : ['history','initial','parallel','final','virtual'],
  HIGHLIGHT_ANIM_DURATION : 250,
  ANIM_DURATION : 1500,
  LEAF_NODE_PADDING_W : 2.5, 
  LEAF_NODE_PADDING_H : 2.5,
  INITIAL_RADIUS : 4,
  finalStateGradientId : 'finalStateGradient',
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

angular.module('schviz2.constants',[])
.constant('klayOptions',
{
    right: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
      labelSpacing : 1,
      layoutHierarchy: true,
      intCoordinates: true,
      edgeRouting: "ORTHOGONAL"
    },
    auto: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      borderSpacing : 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL"
    },
    layer: {
      algorithm: "de.cau.cs.kieler.klay.layered",
      spacing: 10,
      layoutHierarchy: true,
      intCoordinates: true,
      direction: "DOWN",
      edgeRouting: "ORTHOGONAL",
      cycleBreaking: "INTERACTIVE",
      nodeLayering: "INTERACTIVE"
    }/*,
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
})

.constant('scxmlExamples', [
  '/examples/universal-morse-input-output/build/morse.scxml',
  '/examples/svg-graphical-modelling-environment-framework/behaviour/default.xml',
  '/examples/archive.org-twilio-browser/content/archive.xml'
]);

angular.module('schviz2.constants',[])
.constant('klayOptions',['right','auto','layer'])

.constant('transitionTypeTests', [
  '/tests/transition-types/test0.scxml',
  '/tests/transition-types/test1.scxml',
  '/tests/transition-types/test2.scxml',
  '/tests/transition-types/test3.scxml',
  '/tests/transition-types/test4.scxml',
  '/tests/transition-types/test5.scxml',
  '/tests/transition-types/test6.scxml',
  '/tests/transition-types/test7.scxml',
  '/tests/transition-types/test8.scxml',
  '/tests/transition-types/test9.scxml',
  '/tests/transition-types/test10.scxml'
])

.constant('scxmlExamples', [
  '/examples/universal-morse-input-output/build/morse.scxml',
  '/examples/svg-graphical-modelling-environment-framework/behaviour/default.xml',
  '/examples/archive.org-twilio-browser/content/archive.xml'
]);

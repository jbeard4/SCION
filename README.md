This project provides a visual morse code parser, which can be used as a
learning tool for people interested in morse code.

The parser is implemented using a state machine, which is partially compiled
from a prefix trie. The state machine is described using SCXML, a language for
processing events. The state machine accepts sensor events as input from Edison
button sensors, processes those events, and outputs a message to the LCD RGB
backlight. This demonstrates how SCXML can be used as a rich language for
processing IoT sensor events and controlling IoT actuators.

![Parser](http://desm-visualization.herokuapp.com/render?scxml=https://cdn.rawgit.com/jbeard4/scxml-morse-code-parser/master/build/morse.scxml)


var morseCode = require('./morse-code.json');
var specialCharacterToStateName = require('./special-character-to-state-name.json');

function State(id,emit){
  this.id = id;
  this.transitions = {};
  this.emit = emit;
}

var trieRoot = new State('idle');

Object.keys(morseCode).forEach(function(c){

  var code = morseCode[c]; 
  var sequence = code.split('').map(function(x){ return x === '.' ? 'dot' : 'dash'});

  var currentNode = trieRoot; 
  var prefix = '';
  //traverse the tree, lazy-initing nodes as needed, until we reach a terminal
  sequence.forEach(function(s){
    prefix += s;

    currentNode =
      currentNode.transitions[s] = 
        currentNode.transitions[s] || new State(prefix);
  });
  var terminalStateName = specialCharacterToStateName[c] || c;
  currentNode.transitions['short_pause'] = new State(terminalStateName,c);   //followed by a dash, takes you to terminal

  //anything else takes you to a parser error
});

module.exports = trieRoot;

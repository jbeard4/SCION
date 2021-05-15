//flatten out the trie - harvest all the states
//replace states with id references
//create a template that generates SCXML code

var trie = require('./morse-to-trie');
var fs = require('fs');
var ejs = require('ejs');

var states = [];

function walk(node){
  if(!node.transitions) return;
  states.push(node);
  node.transitions = Object.keys(node.transitions).map(function(event){
    var childState = node.transitions[event];
    walk(childState);
    return {
      event : event,
      target : childState.id
    };
  });
}

walk(trie);

//console.log(JSON.stringify(states,4,4))

//now generate SCXML
var filename = './components/index.scxml.ejs';
var str = fs.readFileSync(filename, 'utf8'); 
var scxmlString = ejs.render(str, {states : states}, {filename : filename});

console.log(scxmlString);

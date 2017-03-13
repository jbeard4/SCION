const SCHVIZ = require('./node_modules/SCHVIZ2/dist/index.js');
const scxml = require('scion');
const fs = require('fs');
const pathToScxml = window.location.search.slice(1)

window.title = pathToScxml;

const schvizRoot = document.getElementById('schviz');
let schviz;
function initialRender(){
  //read, and perform initial render
  let scxmlContents = fs.readFileSync(pathToScxml,'utf8');
  //if he is SCXML, convert him to scjson
  let scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
  schviz = new SCHVIZ(schvizRoot);
  schviz.renderSCJSON(scjson, 'right', function(err){
    if(err) return console.error(err);

    //if everything worked, then watch the file for changes
    fs.watchFile(pathToScxml, {persistent: true, interval : 100}, (cur, prev) => {
      scxmlContents = fs.readFileSync(pathToScxml,'utf8');
      //if he is SCXML, convert him to scjson
      scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
      schviz.updateSCJSON(scjson, 'right', function(err){
        if(err) return console.error(err);
      });
    });
  });
}
initialRender();

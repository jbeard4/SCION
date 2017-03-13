const SCHVIZ = require('SCHVIZ2');
const scxml = require('scion');
const fs = require('fs');
const ipc = require('electron').ipcRenderer

const params = getQueryParameters(); 
const pathToScxml = params.scxmlFile;
let layout = params.layout;

const schvizRoot = document.getElementById('schviz');
let schviz;
function initialRender(){
  //read, and perform initial render
  let scxmlContents = fs.readFileSync(pathToScxml,'utf8');
  //if he is SCXML, convert him to scjson
  let scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
  schviz = new SCHVIZ(schvizRoot);
  schviz.renderSCJSON(scjson, layout, function(err){
    if(err) return console.error(err);

    //if everything worked, then watch the file for changes
    fs.watchFile(pathToScxml, {persistent: true, interval : 100}, (cur, prev) => {
      scxmlContents = fs.readFileSync(pathToScxml,'utf8');
      //if he is SCXML, convert him to scjson
      scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
      schviz.updateSCJSON(scjson, layout, function(err){
        if(err) return console.error(err);
      });
    });
  });
}
initialRender();

ipc.on('update-layout', (e, layoutName) => {
  console.log('update-layout layoutName', e, layoutName);
  layout = layoutName;
  schviz.updateLayout(layoutName, (err) => {
    if(err) return console.error(err);
  });
}); 

function getQueryParameters(){
  return document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

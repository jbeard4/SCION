const fs = require('fs');
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const preferences = require('./preferences')

const params = getQueryParameters(); 
const pathToScxml = params.scxmlFile;

let layout = preferences.defaultLayout;

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

const menu = new Menu()
let items = Object.keys(SCHVIZ.layouts).map(function(layoutName){
  let item = new MenuItem({ 
    label: layoutName, 
    type: 'checkbox', 
    checked: layout === layoutName,
    click : () => {
      layout = layoutName;
      items.forEach( i => i.checked = i === item );
      schviz.updateLayout(layoutName, (err) => {
        if(err) return console.error(err);
      });
    }
  });

  menu.append(item);
  return item;
})

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  menu.popup(remote.getCurrentWindow())
}, false)

function getQueryParameters(){
  return document.location.search.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
}

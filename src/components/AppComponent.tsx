import * as React from "react";
import SCHVIZ from 'schviz2';
import Console from 'console-component';
import scxml = require('scxml');
import RunButton from './RunButton';
import electron = require('electron');
import {handleError, clear} from '../handle-errors';

const remote = electron.remote;
const {Menu, MenuItem} = remote;

import fs = require('fs');

interface AppComponentState {
  interpreter? : any;     //TODO: scion needs a .d.ts. for scxml instance, and for scjson
  scjson? : any;            //scjson needs a typescript definition
  layoutOptions? : any;
  layoutName : string;
  configuration? : string[];
}

interface AppComponentProps {
  scxmlPath : string;
  //scxmlString? : string;
  //scxmlUrl? : string;
}

export default class AppComponent extends React.Component<AppComponentProps, AppComponentState> {

  constructor(props){
    super(props);

    //read, and perform initial render
    let scxmlContents;
    try {
      scxmlContents = fs.readFileSync(props.scxmlPath,'utf8');
    } catch (err){
      handleError(err);
      return;
    }

    //if he is SCXML, convert him to scjson
    const initialLayout = 'right';
    this.state ={ 
      interpreter : null,
      scjson : scxml.ext.compilerInternals.scxmlToScjson(scxmlContents),
      layoutName : initialLayout,
      layoutOptions : SCHVIZ.layouts[initialLayout] 
    };

    this.initContextMenu();

    //if everything worked, then watch the file for changes
    fs.watchFile(props.scxmlPath, {persistent: true, interval : 100}, (cur, prev) => {
      clear();
      let scxmlContents = fs.readFileSync(props.scxmlPath,'utf8');
      //if he is SCXML, convert him to scjson
      this.setState({ 
        interpreter : null,
        scjson : scxml.ext.compilerInternals.scxmlToScjson(scxmlContents)
      });
    });
  }

  private initContextMenu(){
    const menu = new Menu()
    let items = Object.keys(SCHVIZ.layouts).map((layoutName) => {
      let item = new MenuItem({ 
        label: layoutName, 
        type: 'checkbox', 
        checked: this.state.layoutName === layoutName,
        click : () => {
          items.forEach( i => i.checked = i === item );
          this.setState({
            layoutName : layoutName,
            layoutOptions : SCHVIZ.layouts[layoutName]
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
  }


  handleRunButtonClick(event){
    //create a new scxml instance
    //bind it to highlight behavior
    //then call setState
    if(this.state.interpreter){
      this.setState({
        interpreter : null,
        configuration : null
      });
    }else {
      //start him
      this.startScxml();
    }
  }

  startScxml(){

    //1 - 2. get the xml file and convert it to json
    scxml.pathToModel(this.props.scxmlPath, (err,model) => {

        if(err){
            console.error(err);
            process.exit(1);
        }

        model.prepare((err, fnModel) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            //Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
            var interpreter = new scxml.scion.Statechart(fnModel);

            interpreter.start();

            this.setState({
              interpreter : interpreter,
              configuration : interpreter.getConfiguration() 
            });
        
        })

    });

  }

  sendEvent(eventObject){
    this.setState({
      configuration : this.state.interpreter.gen(eventObject)
    });
  }

  render(){
    if(!this.state) return <div>There was an error.</div>;
    return <div id="embed_outer" className={this.state.interpreter ? 'simulation-mode' : 'viz-mode'}>
      <div id="embed_inner">
        <div id="scxml-content">
          <SCHVIZ scjson={this.state.scjson} layoutOptions={this.state.layoutOptions} configuration={this.state.configuration}/>
        </div>
      </div>
      <RunButton running={this.state.interpreter} handleClick={this.handleRunButtonClick.bind(this)}/>
      <Console 
        handleSubmit={this.sendEvent.bind(this)}
        isActive={!!this.state.interpreter}
        />
    </div>;
  }
}


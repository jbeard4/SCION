import SCHVIZ = require('SCHVIZ2');
import * as React from "react";
import SCXMLVisualization from './SCXMLVisualization';
import preferences = require('../../preferences');
import scxml = require('scxml');
import RunButton from './RunButton';

import fs = require('fs');

let layout = preferences.defaultLayout;

interface AppComponentState {
  scxmlInstance? : any;     //TODO: scion needs a .d.ts. for scxml instance, and for scjson
  scjson? : any;            //scjson needs a typescript definition
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
    let scxmlContents = fs.readFileSync(props.scxmlPath,'utf8');
    //if he is SCXML, convert him to scjson
    this.state ={ 
      scxmlInstance : null,
      scjson : scxml.ext.compilerInternals.scxmlToScjson(scxmlContents)
    };

    //if everything worked, then watch the file for changes
    fs.watchFile(props.scxmlPath, {persistent: true, interval : 100}, (cur, prev) => {
      let scxmlContents = fs.readFileSync(props.scxmlPath,'utf8');
      //if he is SCXML, convert him to scjson
      this.setState({ 
        scxmlInstance : this.state.scxmlInstance,
        scjson : scxml.ext.compilerInternals.scxmlToScjson(scxmlContents)
      });
    });
  }

  render(){
    return <div id="embed_outer" className={this.state.scxmlInstance ? 'simulation-mode' : 'viz-mode'}>
      <div id="embed_inner">
        <div id="scxml-content">
          <SCXMLVisualization scjson={this.state.scjson} />
        </div>
      </div>
      <RunButton running={this.state.scxmlInstance}/>
      <div id="console">
        <input type="text" id="event-input"></input>
        <input type="button" id="event-button" value="Send Event"></input>
      </div>
    </div>;
  }
}


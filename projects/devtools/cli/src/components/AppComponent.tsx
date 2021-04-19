import * as React from "react";
import SCHVIZ from '@scion-scxml/schviz';
import scxml = require('@scion-scxml/scxml');
import scion = require('@scion-scxml/core');
import {handleError, clear} from '../handle-errors';

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
  hideActions : boolean;
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
    const tic = new Date() as any;
    const scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
    const toc = new Date() as any;
    console.log('SCXML -> SCJSON duration', toc - tic)
    this.state ={ 
      interpreter : null,
      scjson : scjson,
      layoutName : initialLayout,
      layoutOptions : SCHVIZ.layouts[initialLayout] 
    };

    //if everything worked, then watch the file for changes
    fs.watchFile(props.scxmlPath, {persistent: true, interval : 100}, (cur, prev) => {
      clear();
      let scxmlContents = fs.readFileSync(props.scxmlPath,'utf8');
      const tic = new Date() as any;
      const scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
      const toc = new Date() as any;
      console.log('SCXML -> SCJSON duration', toc - tic)
      //if he is SCXML, convert him to scjson
      this.setState({ 
        interpreter : null,
        scjson : scjson 
      });
    });
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
            var interpreter = new scion.Statechart(fnModel);

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
          <SCHVIZ
            scjson={this.state.scjson}
            layoutOptions={this.state.layoutOptions}
            configuration={this.state.configuration}
            hideActions={this.props.hideActions}
            />
        </div>
      </div>
    </div>;
  }
}


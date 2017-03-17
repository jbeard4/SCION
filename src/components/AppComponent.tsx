import SCHVIZ = require('SCHVIZ2');
import * as React from "react";
import SCXMLVisualization from './SCXMLVisualization';
import preferences = require('../../preferences');
import scxml = require('scxml');
import RunButton from './RunButton';
import ConsoleComponent from './Console';

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

  viz : SCXMLVisualization;
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

  handleRunButtonClick(event){
    //create a new scxml instance
    //bind it to highlight behavior
    //then call setState
    if(this.state.scxmlInstance){
      //TODO: unregister listeners. clean up timers. anything else to destroy an instance?
      this.setState({
        scxmlInstance : null,
        scjson : this.state.scjson
      });
      this.viz.unhighlightAllStates();
    }else {
      //start him
      this.startScxml();
    }
  }

  startScxml(){
    var listeners = {
        onEntry: (stateId) => { 
          console.log('entering state ' + stateId); 
          this.viz.highlightState(stateId);
        },
        onExit: (stateId) => { 
          console.log('exiting state ' + stateId); 
          this.viz.unhighlightState(stateId);
        },
        onTransition: (sourceStateId, targetIds, transitionIdx) => {
            if (targetIds && targetIds.length) {
                console.log('transitioning from ' + sourceStateId + ' to ' + targetIds.join(','));
                this.viz.highlightTransition(sourceStateId, transitionIdx);
            } else {
                console.log('executing target-less transition in ' + sourceStateId);
            }
        },
        onError: (err) => {
            console.log('ERROR:' + JSON.stringify(err));
        }
    };

    function customSend(event, options) {
        console.log('SEND: ' +
            JSON.stringify(event) +
            ', options: ' +
            JSON.stringify(options));
    }

    var interpOpts = {
        customSend: customSend
    }

    //1 - 2. get the xml file and convert it to jsonml
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
            var interpreter = new scxml.scion.Statechart(fnModel, interpOpts);


            interpreter.registerListener(listeners);


            interpreter.start();

            this.setState({
              scxmlInstance : interpreter,
              scjson : this.state.scjson
            });
        
            console.log(interpreter.getConfiguration());
        })

    });

  }

  sendEvent(eventObject){
    this.state.scxmlInstance.gen(eventObject);
  }

  render(){
    return <div id="embed_outer" className={this.state.scxmlInstance ? 'simulation-mode' : 'viz-mode'}>
      <div id="embed_inner">
        <div id="scxml-content">
          <SCXMLVisualization scjson={this.state.scjson} ref={ (viz) => this.viz = viz }/>
        </div>
      </div>
      <RunButton running={this.state.scxmlInstance} handleClick={this.handleRunButtonClick.bind(this)}/>
      <ConsoleComponent handleSubmit={this.sendEvent.bind(this)}/>
    </div>;
  }
}


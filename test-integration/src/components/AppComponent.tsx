import * as React from "react";
import scxml = require('@jbeard/scxml');    //TODO: make scxml an es6 module
                                    //TODO: expose SCJSON object type, so we do not need to use "any" type
import SCHVIZ from '../../..';
import Console from 'console-component';

interface AppComponentState {
  allTests : string[]; 
  scjson : scxml.scion.SCState;
  fnModel : scxml.scion.ModelFactory;
  layoutOptions? : any;
  redraw? : boolean;
  disableAnimation? : boolean;
  interpreter : scxml.scion.Statechart;
  configuration? : string[];
}

export default class AppComponent extends React.Component<{}, AppComponentState> {

  mergeCheckbox : HTMLInputElement;
  animateCheckbox : HTMLInputElement;

  constructor(props){
    super(props);
    this.state = {
      allTests : [],
      scjson : null,
      fnModel : null,
      redraw : false,
      disableAnimation : true,
      interpreter : null,
      configuration : null
    };
    this.loadData();
  }

  private loadData(){
    const scionCoreBaseUrl= '/test-integration/node_modules/@jbeard/scion-core/test/tests';
    jQuery.getJSON(`${scionCoreBaseUrl}/tests.json`).then((responseData) => {
      let testPairs = 
            [
              '/tests/transition-types/test0.scxml',
              '/tests/transition-types/test1.scxml',
              '/tests/transition-types/test2.scxml',
              '/tests/transition-types/test3.scxml',
              '/tests/transition-types/test4.scxml',
              '/tests/transition-types/test5.scxml',
              '/tests/transition-types/test6.scxml',
              '/tests/transition-types/test7.scxml',
              '/tests/transition-types/test8.scxml',
              '/tests/transition-types/test9.scxml',
              '/tests/transition-types/test10.scxml'
            ].concat(
              responseData.map((testUrl) =>`${scionCoreBaseUrl}/${testUrl}`)
            );
      this.setState({
        allTests : testPairs 
      });
      this.handleTestChange({target : {value : testPairs[0]}});
    });
  }

  componentDidMount(){
    this.mergeCheckbox.checked = !this.state.redraw;
    this.animateCheckbox.checked = !this.state.disableAnimation;
  }

  private handleTestChange(event){
    const url = event.target.value;
    const jqXHR = jQuery.ajax({
      url : url,
      method : 'GET',
      dataType : 'text'
    });
    jqXHR.then((responseData) => {
      let contentType = jqXHR.getResponseHeader('content-type'); 

      switch(contentType){
        case 'application/scxml+xml':
        case 'text/xml':
        case 'application/xml':
          scxml.documentStringToModel(url, responseData, (err, model : scxml.ModelFactoryFactory) => {
            if(err) throw err;
            model.prepare((err, fnModel : scxml.scion.ModelFactory) => {
              if(err) throw err;
              this.setState({
                interpreter : null,
                configuration : null,
                scjson : null,
                fnModel : fnModel
              }); 
            });
          });
          break;
        case 'application/json':
          this.setState({
            interpreter : null,
            configuration : null,
            scjson : JSON.parse(responseData),
            fnModel : null
          }); 
          break;
        case 'application/javascript':
          this.setState({
            interpreter : null,
            configuration : null,
            scjson : null,
            fnModel : eval(responseData.replace(/module.exports *= */,''))
          }); 
          break;
        default:
    ;     throw new Error('Unrecognized mime type in response');
      }
    });
    }

    private handleLayoutChange(event){
      this.setState({
        layoutOptions : SCHVIZ.layouts[event.target.value]
      });
    }

    private handleMergeChange(event){
      this.setState({
       redraw : !event.target.checked
      });
    }

    private handleAnimateChange(event){
      this.setState({
       disableAnimation : !event.target.checked
      });
    }

    private stopInterpreter(cb? : () => any){
        this.setState({
          interpreter : null,
          configuration : null
        }, cb || (() => (null))); 
    }

    handleSimulatorClick(event){
      event.stopPropagation();
      event.preventDefault();
      if(this.state.interpreter){
        this.stopInterpreter();
      }else{
        let interpreter = new scxml.scion.Statechart(this.state.fnModel ? this.state.fnModel : this.state.scjson); 
        interpreter.start();
        let configuration = interpreter.getConfiguration();
        this.setState({
          interpreter : interpreter,
          configuration : configuration
        });
      }
    }

    render(){
      return <div className="flex grow">
        <div>
          <form className="form-horizontal">
            <div className="control-group">
              <label className="control-label">Example</label>
              <div className="controls">
                <select onChange={this.handleTestChange.bind(this)}>
                  {
                    this.state.allTests.map( (test, i) => <option key={i}>{test}</option> )
                  }
                </select>
              </div>
            </div>
            <div className="control-group">
              <label className="control-label">Layout</label>
              <div className="controls">
                <select onChange={this.handleLayoutChange.bind(this)}>
                  {
                    Object.keys(SCHVIZ.layouts).map((layout, i) => <option key={i}>{layout}</option>) 
                  }
                </select>
              </div>
            </div>
            <div className="control-group">
              <label className="checkbox">
                <input type="checkbox"  ref={(e) => this.mergeCheckbox = e} onChange={this.handleMergeChange.bind(this)}></input>
                Merge
              </label>
            </div>
            <div className="control-group">
              <label className="checkbox">
                <input type="checkbox"  ref={(e) => this.animateCheckbox = e} onChange={this.handleAnimateChange.bind(this)}></input>
                Animate
              </label>
            </div>
            <div className="control-group">
              <button onClick={this.handleSimulatorClick.bind(this)}>{this.state.interpreter ? 'Stop' : 'Start' } Simulator</button>
            </div>
          </form>
        </div>
        <div className="flex grow">
          <div className="grow">
            {this.state && (this.state.fnModel || this.state.scjson) && 
              <SCHVIZ
                scjson={this.state.fnModel ? this.state.fnModel() : this.state.scjson}

                layoutOptions={this.state.layoutOptions}
                redraw={this.state.redraw}
                configuration={this.state.configuration}
                disableAnimation={this.state.disableAnimation}
                />
            }
          </div>
          <Console  
            handleSubmit={(e : scxml.scion.Event) => this.setState({configuration : this.state.interpreter.gen(e)})} 
            isActive={!!this.state.interpreter}/>
        </div>
      </div>;
    }
}

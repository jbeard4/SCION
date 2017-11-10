import * as React from "react";
import scxml = require('@jbeard/scxml');    //TODO: make scxml an es6 module
                                    //TODO: expose SCJSON object type, so we do not need to use "any" type
import SCHVIZ from '../../..';
import Console from 'console-component';

interface AppComponentState {
  pathToSCXML? : string;
  scxmlDocumentString? : string;
  urlToSCXML? : string;
  scjson? : scxml.scion.SCState;

  targetAPI : string;
  pathToSelectedTest : string;

  allTests : string[]; 
  layoutOptions? : any;
  redraw? : boolean;
  disableAnimation? : boolean;
  interpreter : scxml.scion.Statechart;
  configuration? : string[];
}

export default class AppComponent extends React.Component<{}, AppComponentState> {

  mergeCheckbox : HTMLInputElement;
  apiRadioButton : HTMLInputElement;
  animateCheckbox : HTMLInputElement;
  pathToScxmlSelectElement : HTMLSelectElement;

  constructor(props){
    super(props);
    this.state = {
      allTests : [],
      scjson : null,
      redraw : false,
      disableAnimation : true,
      interpreter : null,
      configuration : null,
      pathToSelectedTest : null,
      targetAPI : 'pathToSCXML'    //TODO: set initial targetAPI
    };
    this.loadData();
  }

  private loadData(){
    jQuery.getJSON('/scxml-tests').then((responseData) => {
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
              responseData.map(pair => pair[0])
            );
      this.setState({
        allTests : testPairs,
        pathToSelectedTest : localStorage.pathToSelectedTest || testPairs[0]
      }, () => {
        this._setInitialElementState();
        this.refreshDataStructuresOnChange()
      });
    });
  }


  private refreshDataStructuresOnChange(){
    if(this.state.pathToSelectedTest.match(/\.(sc)?xml$/)){
      //If this.state.targetAPI is set to pathToSCXML or urlToSCXML, we can set
      //this in the state and return. Fetch and transform will be done inside
      //of SCHVIZ.
      if(this.state.targetAPI === 'pathToSCXML'){
        return this.setState({
          pathToSCXML : this.state.pathToSelectedTest,
          urlToSCXML : null,
          scxmlDocumentString : null,
          scjson : null,
          interpreter : null,
          configuration : null
        }); 
      } else if(this.state.targetAPI ===  'urlToSCXML'){
        return this.setState({
          pathToSCXML : null,
          urlToSCXML : this.state.pathToSelectedTest,
          scxmlDocumentString : null,
          scjson : null,
          interpreter : null,
          configuration : null
        }); 
      }
    } 

    const jqXHR = jQuery.ajax({
      url : this.state.pathToSelectedTest,
      method : 'GET',
      dataType : 'text'
    });
    jqXHR.then((responseData) => {
      let contentType = jqXHR.getResponseHeader('content-type').split(';')[0]; 

      switch(contentType){
        case 'application/scxml+xml':
        case 'text/xml':
        case 'application/xml':
          switch(this.state.targetAPI){
            case 'scxmlDocumentString':
              this.setState({
                pathToSCXML : null,
                urlToSCXML : null,
                scxmlDocumentString : responseData,
                scjson : null,
                interpreter : null,
                configuration : null
              }); 
              break;
            case 'scjson':
              this.setState({
                pathToSCXML : null,
                urlToSCXML : null,
                scxmlDocumentString : null,
                scjson : scxml.ext.compilerInternals.scxmlToScjson(responseData),
                interpreter : null,
                configuration : null
              }); 
              break;
            default:
              throw new Error('Unexpected API');
          }
          break;
        case 'application/json':
          if(this.state.targetAPI === 'scjson'){
            this.setState({
              pathToSCXML : null,
              urlToSCXML : null,
              scxmlDocumentString : null,
              scjson : JSON.parse(responseData),
              interpreter : null,
              configuration : null
            }); 
          } else {
            throw new Error('Unexpected API ' + this.state.targetAPI + ' for document type application/json');
          }
          break;
        case 'application/javascript':
          //TODO: better support this case
          let modelFactory = eval(responseData.replace(/module.exports *= */,''));
          switch(this.state.targetAPI){
            case 'scjson':
              this.setState({
                pathToSCXML : null,
                urlToSCXML : null,
                scxmlDocumentString : null,
                scjson : modelFactory(),
                interpreter : null,
                configuration : null
              }); 
              break;
            default:
              throw new Error('Unexpected API');
          }
          break;
        default:
         throw new Error('Unrecognized mime type in response');
      }
    });
  }
 

  componentDidMount(){
    this._setInitialElementState();
  }

  _setInitialElementState(){
    this.mergeCheckbox.checked = !this.state.redraw;
    this.animateCheckbox.checked = !this.state.disableAnimation;
    this.apiRadioButton.checked = true;
    this.pathToScxmlSelectElement.selectedIndex = Array.prototype.slice.call(this.pathToScxmlSelectElement.options).map( o => o.value ).indexOf(this.state.pathToSelectedTest);
    this.pathToScxmlSelectElement.focus();
  }

  private handleAPIChange(event){
    this.setState({
      targetAPI : event.target.value 
    }, this.refreshDataStructuresOnChange.bind(this));
  }

  private handleTestChange(event){
    localStorage.pathToSelectedTest = event.target.value;
    this.setState({
      pathToSelectedTest : event.target.value 
    }, this.refreshDataStructuresOnChange.bind(this));
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
        this.state.interpreter.off('onBigStepEnd');
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

        const handleModelFactoryFactory = (err, model : scxml.ModelFactoryFactory) => {
          if(err) throw err;
          model.prepare((err, modelFactory : scxml.scion.ModelFactory) => {
            if(err) throw err;
            handleModelOrModelFactory(modelFactory);
          });
        }

        const handleModelOrModelFactory = (model : scxml.scion.SCState | scxml.scion.ModelFactory) => {
          let interpreter = new scxml.scion.Statechart(model); 
          interpreter.on('onBigStepEnd',() => {
            this.setState({
              configuration : interpreter.getConfiguration() 
            });
          })
          interpreter.start();
          let configuration = interpreter.getConfiguration();
          this.setState({
            interpreter : interpreter,
            configuration : configuration
          });
        };

        switch(this.state.targetAPI){
          case 'pathToSCXML':
            scxml.pathToModel(this.state.pathToSCXML, handleModelFactoryFactory);
            break;
          case 'urlToSCXML':
            scxml.urlToModel(this.state.urlToSCXML, handleModelFactoryFactory);
            break;
          case 'scxmlDocumentString':
            scxml.documentStringToModel(null, this.state.scxmlDocumentString, handleModelFactoryFactory);
            break;
          case 'scjson':
            handleModelOrModelFactory(this.state.scjson);
            break;
          default:
            throw new Error('Unexpected API');
        }

        
      }
    }

    render(){
      return <div className="flex grow">
        <div>
          <form className="form-horizontal">
            <div className="control-group">
              <label className="control-label">Example</label>
              <div className="controls">
                <select ref={(e) => this.pathToScxmlSelectElement = e} onChange={this.handleTestChange.bind(this)}>
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
              Interface to test:
              <div>
                <input ref={(e) => this.apiRadioButton = e} onChange={this.handleAPIChange.bind(this)} type="radio" id="apiChoice1"
                 name="api" value="pathToSCXML">
                </input>
                <label htmlFor="apiChoice1">pathToSCXML</label>

                <input onChange={this.handleAPIChange.bind(this)} type="radio" id="apiChoice2"
                 name="api" value="urlToSCXML">
                </input>
                <label htmlFor="apiChoice2">urlToSCXML</label>

                <input onChange={this.handleAPIChange.bind(this)} type="radio" id="apiChoice3"
                 name="api" value="scxmlDocumentString">
                </input>
                <label htmlFor="apiChoice3">scxmlDocumentString</label>

                <input onChange={this.handleAPIChange.bind(this)} type="radio" id="apiChoice5"
                 name="api" value="scjson">
                </input>
                <label htmlFor="apiChoice5">scjson</label>
              </div>
            </div>
            <div className="control-group">
              <button onClick={this.handleSimulatorClick.bind(this)}>{this.state.interpreter ? 'Stop' : 'Start' } Simulator</button>
            </div>
          </form>
        </div>
        <div className="flex grow">
          <div className="grow">

            {this.state && (
                this.state.pathToSCXML ||
                this.state.urlToSCXML || 
                this.state.scxmlDocumentString || 
                this.state.scjson
              ) &&
              <SCHVIZ
                pathToSCXML={this.state.pathToSCXML}
                urlToSCXML={this.state.urlToSCXML}
                scxmlDocumentString={this.state.scxmlDocumentString}
                scjson={this.state.scjson}
                layoutOptions={this.state.layoutOptions}
                redraw={this.state.redraw}
                configuration={this.state.configuration}
                disableAnimation={this.state.disableAnimation}
                />
            }
          </div>
          <Console  
            handleSubmit={(e : scxml.scion.Event) => this.state.interpreter.gen(e)} 
            isActive={!!this.state.interpreter}/>
        </div>
      </div>;
    }
}

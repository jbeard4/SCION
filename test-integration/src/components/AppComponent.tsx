import * as React from "react";
import scxml = require('scxml');    //TODO: make scxml an es6 module
                                    //TODO: expose SCJSON object type, so we do not need to use "any" type
import SCHVIZ from '../../..';

interface AppComponentState {
  allTests : string[]; 
  scjson : any; 
  layoutOptions? : any;
}

export default class AppComponent extends React.Component<{}, AppComponentState> {

  constructor(props){
    super(props);
    this.state = {
      allTests : [],
      scjson : null
    };
    this.loadData();
  }

  private loadData(){
    const scionCoreBaseUrl= '/node_modules/scion-core/test/tests';
    jQuery.getJSON(`${scionCoreBaseUrl}/tests.json`).then((responseData) => {
      let testPairs = responseData.map((testUrl) =>`${scionCoreBaseUrl}/${testUrl}`);
      this.setState({
        allTests : testPairs 
      });
      this.handleTestChange({target : testPairs[0]});
    });
  }

  private handleTestChange(event){
    let jqXHR = jQuery.ajax({
      url : event.target.value,
      method : 'GET',
      dataType : 'text'
    });
    jqXHR.then((responseData) => {
      let contentType = jqXHR.getResponseHeader('content-type'); 

      let scjson;
      switch(contentType){
        case 'application/scxml+xml':
        case 'text/xml':
        case 'application/xml':
          scjson = scxml.ext.compilerInternals.scxmlToScjson(responseData);
          break;
        case 'application/json':
          scjson = JSON.parse(responseData);
          break;
        case 'application/javascript':
          scjson = eval(responseData.replace(/module.exports *= */,''))();
          break;
        default:
          throw new Error('Unrecognized mime type in response');
      }

      this.setState({scjson : scjson}); 

    });
  }

  private handleLayoutChange(event){
    this.setState({
      layoutOptions : SCHVIZ.layouts[event.target.value]
    });
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
              <input type="checkbox"></input>
              Merge
            </label>
          </div>
        </form>
      </div>
      <div className="grow">
        <div style={{width:'100%', height:'100%',position:'absolute'}}>
        {this.state && this.state.scjson && 
          <SCHVIZ scjson={this.state.scjson} layoutOptions={this.state.layoutOptions}/>
        }
        </div>
      </div>
    </div>;
  }
}

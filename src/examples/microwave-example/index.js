import React from 'react'
import SCHVIZ from '@jbeard/schviz2';
import { ShowHideSourceCodeLink } from '../../components';
import { SCComponent, Cell } from '../common';
import Buttons from './buttons';
import ButtonsTxt from './buttons.js?txt';
import MicrowaveDemo from './microwave-demo';
import MicrowaveDemoTxt from './microwave-demo.js?txt';

export default class MicrowaveExample extends SCComponent {

  constructor(props){
    super(props, props.microwaveScxml);
  }

  render(){
    return <div>
      <table style={{width: '100%', height: '400px'}}>
        <tbody> 
          <tr>
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={ButtonsTxt}
              component={
                <Buttons sc={this.sc} />
              }
              caption={
                <span> Buttons </span>
              }
              />
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={this.props.microwaveScxml}
              component={
                <SCHVIZ 
                  scxmlDocumentString={this.props.microwaveScxml}
                  disableAnimation={true}
                  disableZoom={true}
                  configuration={this.state && this.state.configuration}
                  disableZoomAnimation={true}
                  transitionsEnabled={this.state && this.state.transitionsEnabled} 
                  expandAllStatesByDefault={true}
                  id="microwave"
                  />
              }
              caption={
                <span>I am a <strong>state machine</strong></span>
              }
              rowSpan="2"
              />
          </tr>
          <tr>
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={MicrowaveDemoTxt}
              component={
                <MicrowaveDemo configuration={this.state && this.state.configuration}/>
              }
              caption={
               <span> Microwave </span>
              }
              />
          </tr>
        </tbody>
      </table>
      <ShowHideSourceCodeLink self={this} />
    </div>
  }
}




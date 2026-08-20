import React from 'react'
import SCHVIZ from '@scion-scxml/schviz';
import scxml from '@scion-scxml/scxml';
import _lampScxml from './two-button-lamp.scxml';
import LampSwitchButtons from './buttons';
import LampSwitchButtonsTxt from './buttons.js?txt';
import LampBulb from '../light-switch-example/lamp-bulb';
import LampBulbTxt from '../light-switch-example/lamp-bulb.js?txt';
import { ShowHideSourceCodeLink } from '../../components';
import { SCComponent, Cell  } from '../common';

export const lampScxml = _lampScxml;

export class TwoButtonLightSwitchExample extends SCComponent {

  constructor(props){
    super(props, lampScxml);
  }

  render(){
    return <div>
      <table style={{width: '100%', height: '400px'}}>
        <tbody> 
          <tr>
            <Cell 
              contentHeight="200px"
              showSourceCode={this.state.showSourceCode}
              sourceCode={LampSwitchButtonsTxt}
              component={
                <LampSwitchButtons sc={this.sc} configuration={this.state && this.state.configuration}/>
              }
              caption={
                <span> Switches </span>
              }
              />
            <Cell 
              contentHeight="400px"
              showSourceCode={this.state.showSourceCode}
              sourceCode={lampScxml}
              component={
                <SCHVIZ 
                  scxmlDocumentString={lampScxml}
                  disableAnimation={true}
                  configuration={this.state && this.state.configuration}
                  disableZoomAnimation={true}
                  transitionsEnabled={this.state && this.state.transitionsEnabled} 
                  id="twoButtonLightSwitch"
                  />
              }
              caption={
                <span>State machine</span>
              }
              rowSpan="2"
              />
          </tr>
          <tr>
            <Cell 
              contentHeight="200px"
              overflow="hidden"
              showSourceCode={this.state.showSourceCode}
              sourceCode={LampBulbTxt}
              component={
                <LampBulb configuration={this.state && this.state.configuration}/>
              }
              caption={
               <span>Light Bulb</span>
              }
              />
          </tr>
        </tbody>
      </table>
      <ShowHideSourceCodeLink self={this} />
    </div>
  }
}

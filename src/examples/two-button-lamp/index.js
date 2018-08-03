import React from 'react'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
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
              showSourceCode={this.state.showSourceCode}
              sourceCode={lampScxml}
              component={
                <SCHVIZ 
                  scxmlDocumentString={lampScxml}
                  disableAnimation={true}
                  disableZoom={true}
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


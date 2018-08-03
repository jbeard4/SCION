import React from 'react'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _lampScxml from './simple-lamp.scxml';
import PrismCode from 'react-prism';
import { ShowHideSourceCodeLink } from '../../components';
import LampBulb from './lamp-bulb';
import LampSwitch from './lamp-switch';
import LampBulbTxt from './lamp-bulb.js?txt';
import LampSwitchTxt from './lamp-switch.js?txt';
import { SCComponent } from '../common';

export const lampScxml = _lampScxml;

export class LightSwitchExample extends SCComponent {

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
              sourceCode={LampSwitchTxt}
              component={
                <LampSwitch sc={this.sc} configuration={this.state && this.state.configuration}/>
              }
              caption={
                <span> I am a <strong>light switch</strong>.<br /> You can <strong>touch</strong> me! </span>
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
                  id="lightSwitch"
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
              sourceCode={LampBulbTxt}
              component={
                <LampBulb configuration={this.state && this.state.configuration}/>
              }
              caption={
               <span>I am a <strong>light bulb</strong>.</span>
              }
              />
          </tr>
        </tbody>
      </table>
      <ShowHideSourceCodeLink self={this} />
    </div>
  }
}


export const Cell = ({ component, caption, rowSpan, showSourceCode, prismLanguage, sourceCode } ) => (
  <td rowSpan={rowSpan}>
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <div style={{width: '100%', height: '100%', position: 'absolute'}}>
        <div style={{width: '100%', height: '100%', display:'flex', flexDirection: 'column'}}>
          <div style={{ flexGrow: 1, position: 'relative'}}>
            <div style={{width: '100%', height: '100%', position: 'absolute'}}>
              <div style={{width: '100%', height: '100%', overflow: 'scroll'}}>
                {
                  showSourceCode ? 
                    <PrismCode component="pre" className={`language-${prismLanguage || 'javascript'}`}>
                      { sourceCode }
                    </PrismCode> : 
                    component
                }
              </div>
            </div>
          </div>
          <div style={{textAlign: 'center'}}>{showSourceCode ? '' : caption}</div>
        </div>
      </div>
    </div>
  </td>
)




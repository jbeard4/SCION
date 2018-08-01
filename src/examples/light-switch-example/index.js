import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _lampScxml from './simple-lamp.scxml';
import PrismCode from 'react-prism';
import { ShowHideSourceCodeLink } from '../../components';
import LampBulb from './lamp-bulb';
import LampSwitch from './lamp-switch';
import LampBulbTxt from './lamp-bulb.js?txt';
import LampSwitchTxt from './lamp-switch.js?txt';

export const lampScxml = _lampScxml;

export class LightSwitchExample extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
    scxml.documentStringToModel(null, lampScxml, (err, model) => {
      if(err) throw err;
      model.prepare((err, modelFactory) => {
        if(err) throw err;
        this.sc = new scxml.scion.Statechart(modelFactory);

        let transitionsEnabled;
        this.sc.on('onBigStepBegin',() => {
          transitionsEnabled = new Map();
        })
        this.sc.on('onBigStepEnd',() => {
          this.setState({ 
            configuration : this.sc.getConfiguration(),
            transitionsEnabled 
          });
        })
        this.sc.on('onTransition',(transitionSourceId,targetIds,transitionIndex) => {
          if(transitionsEnabled.has(transitionSourceId)){
            const set = transitionsEnabled.get(transitionSourceId);
            set.add(transitionIndex);
          }else{
            const set = new Set();
            set.add(transitionIndex);
            transitionsEnabled.set(transitionSourceId, set);
          }
        });
        this.sc.start();
      });
    });
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




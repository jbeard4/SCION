import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _lampScxml from './two-button-lamp.scxml';
import { Cell, LampBulb } from './light-switch-example';

export const lampScxml = _lampScxml;

export class TwoButtonLightSwitchExample extends React.Component {

  constructor(props){
    super(props);
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
    return <table style={{width: '100%', height: '400px'}}>
      <tbody> 
        <tr>
          <Cell 
            component={
              <LampSwitch sc={this.sc} configuration={this.state && this.state.configuration}/>
            }
            caption={
              <span> Switches </span>
            }
            />
          <Cell 
            component={
              <SCHVIZ 
                scxmlDocumentString={lampScxml}
                disableAnimation={true}
                disableZoom={true}
                configuration={this.state && this.state.configuration}
                disableZoomAnimation={true}
                transitionsEnabled={this.state && this.state.transitionsEnabled} 
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
  }
}

const LampSwitch = ({sc, configuration}) => (
  <ul>
    <li> <button className="btn btn-primary" onClick={(e) => {sc.gen('switch-on')}}> Switch On </button> </li>
    <li> <button className="btn btn-secondary" onClick={(e) => {sc.gen('switch-off')}}> Switch Off </button> </li>
  </ul>
);


import React from 'react'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _vampireScxml from './vampire.scxml';
import { Cell } from '../light-switch-example';
import dead from './dead.png';
import disabled from './disabled.png';
import intact from './intact.png';
import torpor from './torpor.png';

export const vampireScxml = _vampireScxml;

export class VampireExample extends React.Component {

  constructor(props){
    super(props);
    scxml.documentStringToModel(null, _vampireScxml, (err, model) => {
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
              <div style={{width: '100%', height: '100%', overflow: 'scroll'}}>
                <ul>
                  <li> <button className="btn btn-primary" onClick={(e) => {this.sc.gen('staked')}}> Staked </button> </li>
                  <li> <button className="btn btn-primary" onClick={(e) => {this.sc.gen('un-staked')}}> Un-staked </button> </li>
                  <li> <button className="btn btn-primary" onClick={(e) => {this.sc.gen('chopped-up')}}> Chopped Up </button> </li>
                  <li> <button className="btn btn-primary" onClick={(e) => {this.sc.gen('healed')}}> Healed </button> </li>
                  <li> <button className="btn btn-primary" onClick={(e) => {this.sc.gen('burned')}}> Burned </button> </li>
                </ul>
              </div>
            }
            caption={
              <span> Input Events </span>
            }
            />
          <Cell 
            component={
              <SCHVIZ 
                scxmlDocumentString={_vampireScxml}
                disableAnimation={true}
                disableZoom={true}
                configuration={this.state && this.state.configuration}
                disableZoomAnimation={true}
                expandAllStatesByDefault={true}
                transitionsEnabled={this.state && this.state.transitionsEnabled} 
                id="vampire2"
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
              <div style={{
                width: '100%', 
                height: '100%', 
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundImage:`url(${
                  (() => {
                    switch(this.state && this.state.configuration && this.state.configuration[0]){
                      case 'dead': return dead;
                      case 'disabled': return disabled;
                      case 'intact': return intact;
                      case 'torpor': return torpor;
                      default: return '';
                    }
                  })()
                })`}}>
              </div>
            }
            caption={
             <span>Render of Current State</span>
            }
            />
        </tr>
      </tbody>
    </table>
  }
}

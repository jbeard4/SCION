import React from 'react'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _vampireScxml from './vampire.scxml';
import { Cell } from '../light-switch-example';
import { ShowHideSourceCodeLink } from '../../components';
import VampireImg from './vampire-image'
import VampireImgTxt from './vampire-image.js?txt'
import Buttons from './buttons'
import ButtonsTxt from './buttons?txt'

export const vampireScxml = _vampireScxml;

export class VampireExample extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
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
                <span> Click a button to send an event </span>
              }
              />
            <Cell 
              prismLanguage="xml"
              showSourceCode={this.state.showSourceCode}
              sourceCode={_vampireScxml}
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
                <span>Visualization of the running state machine</span>
              }
              rowSpan="2"
              />
          </tr>
          <tr>
            <Cell 
              sourceCode={VampireImgTxt}
              showSourceCode={this.state.showSourceCode}
              component={
                <VampireImg configuration={this.state.configuration} />
              }
              caption={
               <span>Picture of the vampire's current state</span>
              }
              />
          </tr>
        </tbody>
      </table>
      <ShowHideSourceCodeLink self={this} />
    </div>
  }
}

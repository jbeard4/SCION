import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _dragAndDropScxml from './drag-and-drop.scxml';
import { Cell } from '../light-switch-example';
import DragAndDropDemo from './drag-and-drop-demo';
import DragAndDropDemoTxt from './drag-and-drop-demo.js?txt';
import { ShowHideSourceCodeLink } from '../../components';

export const dragAndDropScxml = _dragAndDropScxml;

export class DragAndDropExample extends React.Component {

  constructor(props){
    super(props);
    this.state = {};
    this.scPromise = new Promise((resolve, reject) => {
      scxml.documentStringToModel(null, dragAndDropScxml, (err, model) => {
        if(err) reject(err);
        model.prepare((err, modelFactory) => {
          if(err) reject(err);
          this.sc = new scxml.scion.Statechart(modelFactory);
          resolve(this.sc);

          let transitionsEnabled;
          this.sc.on('onBigStepBegin',() => {
            transitionsEnabled = new Map();
          })
          this.sc.on('onBigStepEnd',() => {
            const [configuration, history, isInFinalState, datamodel] = this.sc.getSnapshot();
            this.setState({ 
              configuration, 
              datamodel, 
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
    })
  }

  render(){
    return <div>
      <table style={{width: '100%', height: '400px'}}>
        <tbody> 
          <tr>
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={DragAndDropDemoTxt} 
              component={
                <DragAndDropDemo 
                  scPromise={this.scPromise}
                  configuration={this.state.configuration}
                  datamodel={this.state.datamodel}
                  />
              }
              caption={
                <span> Click and drag the rectangle </span>
              }
              />
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={dragAndDropScxml} 
              component={
                <SCHVIZ 
                  scxmlDocumentString={dragAndDropScxml}
                  disableAnimation={true}
                  disableZoom={true}
                  configuration={this.state && this.state.configuration}
                  disableZoomAnimation={true}
                  transitionsEnabled={this.state && this.state.transitionsEnabled} 
                  expandAllStatesByDefault={true}
                  id="drag-and-drop"
                  />
              }
              caption={
                <span>State machine</span>
              }
              />
          </tr>
        </tbody>
      </table>
      <ShowHideSourceCodeLink self={this} />
    </div>
  }
}


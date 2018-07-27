import React from 'react'
import Link from 'gatsby-link'
import get from 'lodash/get'
import Helmet from 'react-helmet'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _dragAndDropScxml from './drag-and-drop.scxml';
import { Cell } from './light-switch-example';
import TutorialPageWrapper from '../../components/TutorialPageWrapper'

export const dragAndDropScxml = _dragAndDropScxml;

export class DragAndDropExample extends React.Component {

  constructor(props){
    super(props);
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
    })
  }

  render(){
    return <table style={{width: '100%', height: '800px'}}>
      <tbody> 
        <tr>
          <Cell 
            component={
              <DragAndDropDemo 
                scPromise={this.scPromise}
                />
            }
            caption={
              <span> HTML Demo </span>
            }
            />
        </tr>
        <tr>
          <Cell 
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
  }
}

class DragAndDropDemo extends React.Component {

  constructor(props){
    super(props);
    this.handleMouseEvent = this.handleMouseEvent.bind(this);
  }

  handleMouseEvent(e){
    e.persist();
    this.props.scPromise.then( (sc) => sc.gen(e.type, e) )
  }

  render() {
    return <div 
        style={{width: '100%', height: '100%'}}
        onMouseMove={ this.handleMouseEvent }
      >
      <div 
        ref={ (e) => {
          if(!this.rect){
            this.rect = e; 
            this.props.scPromise.then( (sc) => sc.gen('init', this.rect) )
          }
        }}
        onMouseDown={ this.handleMouseEvent }
        onMouseUp={ this.handleMouseEvent }
        style={{
          width:'100px',
          height:'100px',
          backgroundColor:'red',
          border:'2px solid black',
          position:'absolute',
          left:'0px'
        }}/>
    </div>
  }
}

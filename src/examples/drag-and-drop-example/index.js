import React from 'react'
import SCHVIZ from '@jbeard/schviz2';
import _dragAndDropScxml from './drag-and-drop.scxml';
import DragAndDropDemo from './drag-and-drop-demo';
import DragAndDropDemoTxt from './drag-and-drop-demo.js?txt';
import { ShowHideSourceCodeLink } from '../../components';
import { SCComponent, Cell  } from '../common';

export const dragAndDropScxml = _dragAndDropScxml;

export class DragAndDropExample extends SCComponent {

  constructor(props){
    super(props, dragAndDropScxml)
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


import React from 'react'
import SCHVIZ from '@jbeard/schviz2';
import scxml from 'scxml';
import _vampireScxml from './vampire.scxml';
import { ShowHideSourceCodeLink } from '../../components';
import VampireImg from './vampire-image'
import VampireImgTxt from './vampire-image.js?txt'
import Buttons from './buttons'
import ButtonsTxt from './buttons?txt'
import { SCComponent, Cell  } from '../common';

export const vampireScxml = _vampireScxml;

export class VampireExample extends SCComponent {

  constructor(props){
    super(props, vampireScxml);
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
          <tr>
            <td> 
              <p 
                onClick={() => this.sc.start()}
                style={{color: 'blue', cursor: 'pointer', fontStyle: 'italic'}}><i className="fas fa-redo"></i> Click to reset the state machine</p>
            </td>
            <td> 
              <ShowHideSourceCodeLink self={this} />
            </td>
          </tr>
        </tbody>
      </table> 
    </div>
  }
}

import React from 'react'
import SCHVIZ from '@jbeard/schviz2';
import historyScxml from './history.scxml';
import HistoryDemo from './history-demo';
import HistoryDemoTxt from './history-demo.js?txt';
import { ShowHideSourceCodeLink } from '../../components';
import { SCComponent, Cell  } from '../common';

export class HistoryExample extends SCComponent {

  constructor(props){
    super(props, historyScxml)
  }

  render(){
    return <div>
      <table style={{width: '100%', height: '400px'}}>
        <tbody> 
          <tr>
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={HistoryDemoTxt} 
              component={
                <HistoryDemo 
                  scPromise={this.scPromise}
                  configuration={this.state.configuration}
                  />
              }
              caption={
                <span> Demo Application </span>
              }
              />
            <Cell 
              showSourceCode={this.state.showSourceCode}
              sourceCode={historyScxml} 
              component={
                <SCHVIZ 
                  scxmlDocumentString={historyScxml}
                  disableAnimation={true}
                  disableZoom={true}
                  configuration={this.state && this.state.configuration}
                  disableZoomAnimation={true}
                  transitionsEnabled={this.state && this.state.transitionsEnabled} 
                  expandAllStatesByDefault={true}
                  layoutOptions={SCHVIZ.layouts.auto}
                  id="history"
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



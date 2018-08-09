import React from 'react'
import scxml from 'scxml';
import PrismCode from 'react-prism';
import SCHVIZ from '@jbeard/schviz2';

export class SCComponent extends React.Component{
  constructor(props, scxmlDocumentString){
    super(props);
    this.state = {};
    this.scPromise = new Promise((resolve, reject) => {
      scxml.documentStringToModel(null, scxmlDocumentString, (err, model) => {
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
}

export const Cell = ({ component, caption, rowSpan, showSourceCode, prismLanguage, sourceCode, overflow = 'scroll' } ) => (
  <td rowSpan={rowSpan} style={{border: '1px solid #eee'}}>
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
      <div style={{width: '100%', height: '100%', position: 'absolute'}}>
        <div style={{width: '100%', height: '100%', display:'flex', flexDirection: 'column'}}>
          <div style={{ flexGrow: 1, position: 'relative'}}>
            <div style={{width: '100%', height: '100%', position: 'absolute'}}>
              <div style={{width: '100%', height: '100%', overflow: showSourceCode ? 'scroll' : overflow }}>
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

export class ToggleableSchviz extends React.Component{
  constructor(props){
    super(props)
    this.state = {showSourceCode: true};
  }

  render(){
    return <div>
      {
        this.state.showSourceCode ? 
          <PrismCode component="pre" className="language-xml">
            {this.props.scxmlDocumentString}
          </PrismCode> :
          <div style={{width: '100%', height: '400px', position: 'relative'}}>
            <SCHVIZ 
              scxmlDocumentString={this.props.scxmlDocumentString}
              disableAnimation={true}
              disableZoom={true}
              disableZoomAnimation={true}
              id={this.props.id}
              />
          </div>
      }
      <p 
        style={{textAlign:'right', color: 'blue', cursor: 'pointer', fontStyle: 'italic'}} 
        onClick={ () => this.setState({showSourceCode : !this.state.showSourceCode}) }>
        {
          this.state.showSourceCode ? 
            <span>Click to show visualization <i className="fas fa-image"></i></span> :
            <span>Click to show source code <i className="fas fa-file-code"></i></span> 
        }
      </p>
    </div> 
  }
}

import React from 'react'
import scxml from 'scxml';
import PrismCode from 'react-prism';

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

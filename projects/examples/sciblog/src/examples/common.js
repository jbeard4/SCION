import React from 'react'
import scxml from '@scion-scxml/scxml';
import Prism from 'prismjs'
import PrismCode from 'react-prism';
import SCHVIZ from '@scion-scxml/schviz';

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
            const [_, history, isInFinalState, datamodel] = this.sc.getSnapshot();
            const configuration = this.sc.getFullConfiguration();
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

export const Cell = ({
  component,
  caption,
  rowSpan,
  showSourceCode,
  prismLanguage,
  sourceCode,
  overflow = 'scroll',
  contentHeight = '400px'
} ) => {
  const captionHeight = showSourceCode ? '0px' : '2.5rem';
  const viewportHeight = showSourceCode ? contentHeight : `calc(${contentHeight} - ${captionHeight})`;

  return (
  <td rowSpan={rowSpan} style={{border: '1px solid #eee', padding: 0, verticalAlign: 'top'}}>
    <div style={{width: '100%'}}>
      <div style={{height: viewportHeight, minHeight: 0, position: 'relative'}}>
        <div style={{width: '100%', height: '100%', overflow: showSourceCode ? 'scroll' : overflow, position: 'relative' }}>
          {
            showSourceCode ? 
              <PrismCode component="pre" className={`language-${prismLanguage || 'javascript'}`}>
                { sourceCode }
              </PrismCode> : 
              component
          }
        </div>
      </div>
      <div style={{height: captionHeight, textAlign: 'center', padding: showSourceCode ? 0 : '0.25rem 0.5rem', overflow: 'hidden'}}>
        {showSourceCode ? '' : caption}
      </div>
    </div>
  </td>
)
}

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

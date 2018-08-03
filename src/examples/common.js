import React from 'react'
import scxml from 'scxml';

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

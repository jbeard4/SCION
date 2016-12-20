import events from './events';

export default class DefaultInteractiveBehavior {

  attachListeners(kgraphRoot){
    events.node.forEach(function(eventName){
      console.log('listening to kgraphRoot', kgraphRoot, eventName);
      kgraphRoot.on('node:' + eventName, this.handleEvent.bind(this, kgraphRoot, eventName));
    }.bind(this));
  }

  handleEvent(kgraphRoot, eventName, scjson, kgraphNode, domEvent){
    //console.log('handleEvent',eventName, scjson, klayNode, domEvent);
    if(eventName === 'dblclick'){
      scjson.$meta = scjson.$meta || {};
      scjson.$meta.isCollapsed = !scjson.$meta.isCollapsed;   //toggle contracted

      kgraphRoot.emit('update');
    }
  }
}

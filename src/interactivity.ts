import events from './events';
import Debug = require('debug');
const debug = Debug('interactivity');

export default class DefaultInteractiveBehavior {

  attachListeners(kgraphRoot){
    events.node.forEach(function(eventName){
      debug('listening to kgraphRoot', kgraphRoot, eventName);
      kgraphRoot.on('node:' + eventName, this.handleEvent.bind(this, kgraphRoot, eventName));
    }.bind(this));
  }

  handleEvent(kgraphRoot, eventName, scjson, kgraphNode, domEvent){
    //debug('handleEvent',eventName, scjson, klayNode, domEvent);
    if(eventName === 'dblclick'){
      scjson.$meta = scjson.$meta || {};
      scjson.$meta.isCollapsed = !scjson.$meta.isCollapsed;   //toggle contracted

      kgraphRoot.emit('update');
    }
  }
}

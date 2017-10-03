/**
 * This is meant to be a lighter example for the SourceNode class in mozilla sourcemap library.
 * This class implements a subset of the soucemap SourceNode API.
 */
function SourceNode(line, column, url, stringOrNodeOrArrayOfStringsOrNodes){ 
  this._children = [];
  if(typeof stringOrNodeOrArrayOfStringsOrNodes !== "undefined") this.add(stringOrNodeOrArrayOfStringsOrNodes);
}

SourceNode.prototype.add = function(stringOrNodeOrArrayOfStringsOrNodes){
  if(Array.isArray(stringOrNodeOrArrayOfStringsOrNodes)){
    stringOrNodeOrArrayOfStringsOrNodes.forEach(process.bind(this));
  }else{
    process.call(this,stringOrNodeOrArrayOfStringsOrNodes);
  }
  function process(strOrNode){
    if(Array.isArray(strOrNode)){
      this._children.push.apply(this._children,strOrNode);
    }else if(typeof strOrNode === 'string' || strOrNode instanceof SourceNode){
      this._children.push(strOrNode);
    }else {
      throw new Error('Unexpected node type')
    }
  }
}

SourceNode.prototype.toString = function(){
  return this._children.map(function(nodeOrString){return nodeOrString.toString();}).join('');
}

module.exports = {
  SourceNode : SourceNode 
};

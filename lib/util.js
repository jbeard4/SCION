function merge(target){
    var sources = Array.prototype.slice.call(arguments).slice(1);
    sources.forEach(function(o){
      Object.keys(o).forEach(function(k){
          target[k] = o[k]; 
      });
    });
    return target;
}

module.exports.merge = merge;

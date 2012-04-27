var http = require('http');

function HTTPClientListener(options){
    this.options = options;

    var agent = new http.Agent();
    agent.maxSockets = 1;     //serialize all requests

    this.defaultOptions = {
        host : "localhost",
        port : "1337",
        agent : agent 
    };

}

function extend(o){
    for(var i = 1; i < arguments.length; i++){
        for(var k in arguments[i]){
            var v = arguments[i][k];
            o[k] = v;
        }
    }
}

HTTPClientListener.prototype = {
    onEntry : function(id){
        http.get(extend(
            { path : "/onEntry?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                //ignore the result
            });
    },
    onExit : function(id){
        http.get(extend(
            { path : "/onExit?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                //ignore the result
            });
    },
    onTransition : function(sourceId,targetIds){
        //TODO
    }
};

module.exports = HTTPClientListener;

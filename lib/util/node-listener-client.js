var http = require('http'),
    _ = require('underscore');

function HTTPClientListener(options){
    this.options = options;
    this.defaultOptions = {
        host : "localhost",
        port : "1337"
    }
}
HTTPClientListener.prototype = {
    onEntry : function(id){
        http.get(_.extend(
            { path : "/onEntry?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                console.log("Got response: " + res.statusCode);
            });
    },
    onExit : function(id){
        http.get(_.extend(
            { path : "/onExit?id=" + id },
            this.defaultOptions,
            this.options),
            function(res){
                console.log("Got response: " + res.statusCode);
            });
    },
    onTransition : function(sourceId,targetIds){
        //TODO
    }
};

module.exports = HTTPClientListener;

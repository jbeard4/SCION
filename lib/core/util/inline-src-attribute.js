var util = require('./util/jsonml');

module.exports = function(jsonml,platformGet,cb){
    
    var scriptActionsWithSrcAttributes = [], errors = [];

    traverse(jsonml,scriptActionsWithSrcAttributes); 

    //async forEach
    function retrieveScripts(){
        var script = scriptActionsWithSrcAttributes.pop();
        if(script){
            platformGet(script[1].src,function(err,text){
                if(err){
                    //just capture the error, and continue on
                    errors.push(err); 
                }

                script.push(text);  //this is how we append a text node
                retrieveScripts();
            });
        }else{
            cb(errors.length ? errors : null);
        }
    }
    retrieveScripts();  //kick him off
};

function traverse(node,nodeList){
    var tuple = util.deconstructNode(node, true), tagName = tuple[0], attrs = tuple[1], children = tuple[2];
    if((tagName === 'script' || tagName === 'data') && attrs && attrs.src){
        nodeList.push(node); 
    } 

    children.forEach(function(child){traverse(child,nodeList);});
}


//go through and pull out all the script tags
//yay, pure functional code
/*
var scriptActionsWithSrcAttributes = 
    annotatedScxmlJson.states.map(function(state){      //returns array of actions associated with that state
        return state.onentry.
                concat(state.onexit).
                concat(
                    state.transitions.
                        map(function(transitionNum){ return annotatedScxmlJson.transitions[transitionNum].actions;}).   //array of arrays of actions
                        reduce(function(a,b){return a.concat(b);},[])).  //flatten him to array of transition actions
        }).
        reduce(function(a,b){return a.concat(b);},[]).  //flattens into array of all actions
        filter(function(action){return action.type === "script" && action.src });
*/

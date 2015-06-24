module.exports = {
    traverseAndCollectAllScriptAndDataNodesWithSrcAttr : function(state,allScriptAndDataNodesWithSrcAttr){
        function addNodesToNodeList(actionNodes){
            var actionNodesWithSrcAttr = 
                    actionNodes.filter(function(actionNode){return (actionNode.type === 'script' || actionNode.type === 'data') && actionNode.src;});

            allScriptAndDataNodesWithSrcAttr.push.apply(allScriptAndDataNodesWithSrcAttr,actionNodesWithSrcAttr);
        }

        if(state.type === 'scxml' && state.rootScripts) addNodesToNodeList(state.rootScripts);
        if(state.onEntry) addNodesToNodeList(state.onEntry);
        if(state.onExit) addNodesToNodeList(state.onExit);
        if(state.transitions){
            state.transitions.
                filter(function(t){
                    return t.onTransition;
                }).
                map(function(t){
                    return t.onTransition;
                }).
                forEach(function(transitionActions){
                    addNodesToNodeList(transitionActions);
                });
        }

        if(state.states){
            var cb = arguments.callee;
            state.states.forEach(function(childState){cb(childState,allScriptAndDataNodesWithSrcAttr);});
        }
    }
};

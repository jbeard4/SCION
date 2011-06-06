define(["util/xpath/defaultNSResolver"],function(defaultNSResolver){

	function xpathSnapshotResultToJsArray(nodes){
		var toReturn = [];
		
		for (var i = 0; i < nodes.snapshotLength; i++) {
			toReturn.push(nodes.snapshotItem(i));
		}
		return toReturn;
	} 

	return function(xpath,contextNode,nsResolver){
		nsResolver = nsResolver || defaultNSResolver;
		contextNode = contextNode || document.documentElement;

		return xpathSnapshotResultToJsArray(
			contextNode.ownerDocument.evaluate(xpath, contextNode, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null));
	}
});

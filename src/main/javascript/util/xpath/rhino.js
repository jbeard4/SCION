define(["util/xpath/defaultNSResolver"],function(defaultNSResolver){

	function xpathSnapshotResultToJsArray(nodes){
		var toReturn = [];
		for (var i = 0; i < nodes.getLength(); i++) {
			toReturn.push(nodes.item(i));
		}
		return toReturn;
	}


	var XPathFactory = Packages.javax.xml.xpath.XPathFactory,
		XPathConstants = Packages.javax.xml.xpath.XPathConstants;

	var factory = XPathFactory.newInstance();

	var xpathExprCache = {};

	return function(xpath,contextNode,nsResolver){
		nsResolver = nsResolver || defaultNSResolver;

		var namespaceContext = new Packages.javax.xml.namespace.NamespaceContext({
			    getNamespaceURI : function(prefix) {
				return nsResolver(prefix) || Packages.javax.xml.XMLConstants.NULL_NS_URI;
			    },

			    // This method isn't necessary for XPath processing.
			    getPrefix : function(uri) {
				throw new  Packages.javax.xml.UnsupportedOperationException();
			    },

			    // This method isn't necessary for XPath processing either.
			    getPrefixes : function(uri) {
				throw new Packages.javax.xml.UnsupportedOperationException();
			    }

		});



		var xpathObj = factory.newXPath();

		xpathObj.setNamespaceContext(namespaceContext);

		//do a bit of caching of compiled expressions to improve performance
		var expr = xpathExprCache[xpath] || 
				(xpathExprCache[xpath] = xpathObj.compile(xpath)); 

		var result = expr.evaluate(contextNode, XPathConstants.NODESET);
		return xpathSnapshotResultToJsArray(result);
	};
});

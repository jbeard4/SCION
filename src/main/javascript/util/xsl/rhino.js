require.def("src/javascript/scxml/cgf/util/xsl/rhino",
["src/javascript/scxml/cgf/util/xml/rhino"],
function(xmlUtil){

	return (function(){
		var TransformerFactory = javax.xml.transform.TransformerFactory,
			XMLReaderFactory = Packages.org.xml.sax.helpers.XMLReaderFactory,
			ByteArrayOutputStream = java.io.ByteArrayOutputStream,
			StreamResult = javax.xml.transform.stream.StreamResult,
			StreamSource = javax.xml.transform.stream.StreamSource,
			StringReader = java.io.StringReader,
			DOMSource = javax.xml.transform.dom.DOMSource,
			SAXResult = javax.xml.transform.sax.SAXResult,
			DOMResult = javax.xml.transform.dom.DOMResult;

		//do transforms
		var tFactory = TransformerFactory.newInstance();

		function getSource(docStringOrFileOrDOM){
			if (typeof docStringOrFileOrDOM == "string"){
				return new StreamSource(new StringReader(docStringOrFileOrDOM));
			}else if(docStringOrFileOrDOM instanceof java.io.File){
				return new StreamSource(docStringOrFileOrDOM);
			}else{
				return new DOMSource(docStringOrFileOrDOM);
			}
		}

		return function(sourceDocument,transformList,params,output){
			transformList = Object.prototype.toString.call(transformList) !== "[object Array]"	? 
						[transformList]			:
						transformList;

			var templates = transformList.map(function(t){return tFactory.newTemplates(getSource(t))})
			var transformHandlers = templates.map(function(t){return tFactory.newTransformerHandler(t)});

			transformHandlers.reduce(function(a,b){
				a.setResult(new SAXResult(b));
				return b;
			});

			var baos = new ByteArrayOutputStream();
			var result = output == "xml" ? new DOMResult() : new StreamResult(baos);

			transformHandlers[transformHandlers.length-1].setResult(result); 

			var transformer = tFactory.newTransformer();

			//set params

			transformHandlers.map(function(th){return th.getTransformer()}).forEach(function(t){
				for(paramName in params){
					var paramValue = params[paramName];
					if(typeof paramValue !== "object"){
						t.setParameter(paramName,params[paramName]);
					}
				}
			});

			transformer.transform(getSource(sourceDocument), new SAXResult(transformHandlers[0]));


			var toReturn;
			switch(output){
				case "xml":
					toReturn = result.getNode();
					break;

				case "text":
					toReturn = String(new java.lang.String(baos.toByteArray()));
					break;
			}
	
			return toReturn;	//node or string
		}
	})()		
});



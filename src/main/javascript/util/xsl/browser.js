require.def("src/javascript/scxml/cgf/util/xsl/browser",
["src/javascript/scxml/cgf/util/xml/browser"],
function(xml){

	

	return function(sourceDocument,transformList,params,output,debug){
		

		transformList = Object.prototype.toString.call(transformList) !== "[object Array]"	? 
					[transformList]			:
					transformList;

		sourceDocument = typeof sourceDocument == "string" ? xml.parseFromString(sourceDocument) : sourceDocument;
		transformList = transformList.map(function(t){return typeof t == "string" ? xml.parseFromString(t) : t});

		function getProcessorFromStylesheetDocument(d){
			var processor = new XSLTProcessor();  
			processor.importStylesheet(d); 
			return processor;
		}


		function getResultTextFromDoc(d){
			var resultText;
			if(d &&
				d.body &&
				d.body.children &&
				d.body.children[0] &&
				d.body.children[0].textContent){

				//chrome
				resultText  = d.body.children[0].textContent
			} else if (d &&
				d.documentElement &&
				d.documentElement.firstChild &&
				d.documentElement.firstChild.textContent){

				//firefox
				resultText = d.documentElement.firstChild.textContent;
			}else{
				console.log("Cannot get resultText out of object " + d);
			}
			return resultText;
		}

		//transform to IR
		var processors = transformList.map(getProcessorFromStylesheetDocument); 

		//set parameters
		processors.forEach(function(p){
			for(paramName in params){
				 var paramValue = params[paramName];
				 if ((typeof paramValue == "string") || (typeof paramValue == "boolean")) 
					p.setParameter(null,paramName,paramValue);
			}
		});

		var docToTransform  = sourceDocument;
		processors.forEach(function(p){
			if(debug) console.dirxml(docToTransform); 
			docToTransform = p.transformToDocument(docToTransform);
		});
		if(debug) console.dirxml(docToTransform); 


		var toReturn;
		switch(output){
			case "text":
				toReturn = getResultTextFromDoc(docToTransform);
				break;
			case "xml":
				toReturn = docToTransform; 
				break;
		}

		return toReturn;	//string or node
	}		
});

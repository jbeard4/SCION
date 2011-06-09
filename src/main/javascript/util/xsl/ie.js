require.def("src/javascript/scxml/cgf/util/xsl/ie",
["src/javascript/scxml/cgf/util/xml/ie"],
function(xmlUtil){

	

	return 	function(sourceDocument,transformList,params,output){

		transformList = Object.prototype.toString.call(transformList) !== "[object Array]"	? 
					[transformList]			:
					transformList;

		//we want a document instead of a string here
		sourceDocument = typeof sourceDocument === "string" ? xmlUtil.parseFromString(sourceDocument) : sourceDocument;

		//we want strings instead of documents here
		var tmpList = new Array(transformList.length);
		for(var i=0, l=transformList.length; i<l; i++){
			tmpList[i] = typeof transformList[i] === "string" ? transformList[i] : transformList[i].xml;
		}
		transformList = tmpList;

		//prepare processors
		//FIXME: this works in IE on WinXP 3, but due to all of the ActiveX code here, i'm not sure how portable, reliable, or performant it is
		//the previous solution was to use the docToTransform.transformNode method, which worked well, but I was unable to find a way to
		//use this method, and also pass in transform parameters. hence the ActiveX. 
		var processors = [];
		for(var i=0, l = transformList.length; i<l; i++){
			 var xsldoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.3.0");
			 var xslt = new ActiveXObject("Msxml2.XSLTemplate.3.0"); 
			 xsldoc.async=false;
			 xsldoc.loadXML(transformList[i]);

			 xslt.stylesheet = xsldoc;
			 var xslproc = xslt.createProcessor();

			 for(paramName in params){
				 var paramValue = params[paramName];
				 if ((typeof paramValue == "string") || (typeof paramValue == "boolean")) 
					 xslproc.addParameter(paramName,paramValue);
			 }

			 processors.push(xslproc);
		}

		//transform to IR
		var docToTransform = sourceDocument;
		for(var i=0,l=processors.length; i < l-1; i++){
			var p = processors[i];

			p.input = docToTransform;
			p.transform();

			var txt = p.output
			docToTransform = xmlUtil.parseFromString(txt);
		}

		var lastFilter = processors[processors.length-1];

		lastFilter.input = docToTransform;
		lastFilter.transform();
		var txt = lastFilter.output

		var toReturn;
		switch(output){
			case "text":
				toReturn = txt;
			break;
			case "xml":
				toReturn = xmlUtil.parseFromString(txt);
			break;
		}

		return toReturn;	//string or node
	}		
});

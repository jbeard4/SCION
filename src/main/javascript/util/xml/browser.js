define({
	parseFromString : function(){
		return function(str){
			var parser = new DOMParser();  
			var doc = parser.parseFromString(str,"text/xml");
			return doc;
		}		
	},
	serializeToString : function(){
		return function(d){
			var s = new XMLSerializer();  
			str = s.serializeToString(d);  
			return str;
		}
	},
	parseFromPath : function(){
		//I think this would use DocumentBuilderFactory
		new Error("No implementation for parseFromPath.");
	}

})

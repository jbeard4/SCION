define(function(){

	//TODO: add some other useful stuff you might encounter in the browser space
	var svgNS = "http://www.w3.org/2000/svg";
	var scxmlNS = "http://www.w3.org/2005/07/scxml";
	var xlinkNS = "http://www.w3.org/1999/xlink";

	return function (prefix) {
		var ns = {
			svg: svgNS , 
			s: scxmlNS , 
			xlink: xlinkNS 
		};
		return ns[prefix] || null;
	};
});

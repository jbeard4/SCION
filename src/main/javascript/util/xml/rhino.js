define({
	parseFromString : function(){
		//I think this would use DocumentBuilderFactory
		new Error("No implementation for parseFromString.");
	},
	serializeToString : function(d){
		var ByteArrayOutputStream = java.io.ByteArrayOutputStream;

		var xmlProps = Packages.org.apache.xml.serializer.OutputPropertiesFactory
								.getDefaultMethodProperties("xml");
		xmlProps.setProperty("indent", "yes");
		xmlProps.setProperty("standalone", "no");

		var serializer = Packages.org.apache.xml.serializer.SerializerFactory.getSerializer(xmlProps);                             

		var baos = new ByteArrayOutputStream();
		var serializer = new Packages.org.apache.xml.serialize.XMLSerializer(
					baos,
					new Packages.org.apache.xml.serialize.OutputFormat());

		serializer.asDOMSerializer().serialize(d);

		var toReturn = String(new java.lang.String(baos.toByteArray()));
		return toReturn;
	},
	parseFromPath : function(path){
		var File = java.io.File;
		var DocumentBuilderFactory = javax.xml.parsers.DocumentBuilderFactory;
		var dbf = DocumentBuilderFactory.newInstance();
		dbf.setNamespaceAware(true);

		var file = new File(path);
		var db = dbf.newDocumentBuilder();
		var doc = db.parse(file);
		return doc;
	}
	
})

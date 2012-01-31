var fs = require('fs'),
	scion = require('scion'),
	util = require('util');

var scxmlJsonStr = fs.readFileSync(process.argv[2],'utf8');

try{
	var scxmlJson = JSON.parse(scxmlJsonStr);
}catch(e){
	console.error(e);
	process.exit(1);
}

//3. annotate him programmatically
var annotatedScxmlJson = scion.annotateScxmlJson(scxmlJson);

//4. Convert the SCXML-JSON document to a statechart object model. This step essentially converts id labels to object references, parses JavaScript scripts and expressions embedded in the SCXML as js functions, and does some validation for correctness. 
var model = scion.json2model(annotatedScxmlJson);
//console.log("model",model)

//5. Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
var interpreter = new scion.NodeInterpreter(model);
//console.log("interpreter",interpreter);

//7. Call the start method on the new intrepreter instance to start execution of the statechart.
interpreter.start();

var template = '<html>\
	<head></head>\
	<body>\
		<p>The current state is: <code>%s</code></p>\
		<h1>Event</h1>\
		<form method="post">\
			<input type="text" name="event"/>\
			<input type="submit"/>\
		</form>\
	</body></html>';
	
var http = require('http'),
	q = require('querystring');


http.createServer(function (req, res) {

	if(req.method === 'POST'){
		var body = '';
		req.on('data',function(data){
			body += data;
		});
		req.on('end',function(data){
			//couple cases for body:
			//first: may or may not come in a query string (e.g. submitted via curl, vs. web page form submit)
			var event;
			try{
				//first try to parse him as straight JSON (e.g. submitted via curl)
				event = JSON.parse(body);
			}catch(e){
				//next, try to parse him as a query string
				var query = q.parse(body);
				try {
					//possibly written as a hand-formatted JSON (this allows the user to add event data)
					event = JSON.parse(query['event']);
				} catch(e){
					//or just the event name
					var eventString = query['event'];
					event = { name : eventString };
				}
			}

			//different possibilities: simple string, or...
			//send the event
			interpreter.gen(new scion.Event(event.name,event.data));

			finish();
		});
	}else{
		finish();
	}

	function finish(){
		//write the response: the current state a textbox
		res.writeHead(200, {'Content-Type': 'text/html'});
			
		var conf = util.inspect(interpreter.getConfiguration().iter());
		var s = util.format(template,conf);

		res.end(s);
	}
}).listen(1337, "127.0.0.1");

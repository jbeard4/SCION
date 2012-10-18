var repl = require('repl'),
    scion = require('scion'),
    http = require('http'),
    util = require('util'),
    q = require('querystring');

//1 - 2. get the xml file and convert it to jsonml
scion.pathToModel(process.argv[2],function(err,model){

    if(err){
        throw err;
    }

    //Use the statechart object model to instantiate an instance of the statechart interpreter. Optionally, we can pass to the construct an object to be used as the context object (the 'this' object) in script evaluation. Lots of other parameters are available.
    var interpreter = new scion.SCXML(model);

    interpreter.start();

    console.log(interpreter.getConfiguration()); 

    startServer(interpreter);
    
});

function startServer(interpreter){

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
                interpreter.gen(event);

                finish();
            });
        }else{
            finish();
        }

        function finish(){
            //write the response: the current state a textbox
            res.writeHead(200, {'Content-Type': 'text/html'});
                
            var conf = util.inspect(interpreter.getConfiguration());
            var s = util.format(template,conf);

            res.end(s);
        }
    }).listen(1337, "127.0.0.1");

}

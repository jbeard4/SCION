var Static = require('node-static');
var spawn = require('child_process').spawn;
var fs = require('fs');


var file = new Static.Server('.');

//start up the browser as a child process
//save his pid

var fileCount = 0;

require('http').createServer(function (request, response) {
    console.log("received request",request.url);
    switch(request.url){
        case "/result":
            var s = "";
            request.on("data",function(data){
                s += data;
            });
            request.on("end",function(){
                fs.writeFile( "data/" + browserName + "/" + (fileCount++), s, "utf8",function(err){
                    if(err){
                        throw err;
                        return
                    }

                    response.writeHead(200);
                    response.end();
                });
            });
            //dump the test result to disk... or direct to database?
            break;
        case "/get-memory":
            //use the saved pid to get memory usage
            fs.readFile("/proc/" + browserProc.pid + "/status","utf8",function(err,contents){
                if(err){
                    response.writeHead(500);
                    response.end();
                    throw err;
                    return;
                }

                var rss = parseInt(contents.match(/\nVmRSS:\s*([0-9]+) kB\n/)[1]);
                var vsz = parseInt(contents.match(/\nVmSize:\s*([0-9]+) kB\n/)[1]);

                console.log("rss",rss,"vsz",vsz);

                response.writeHead(200);
                response.write(JSON.stringify({
                    rss : rss,
                    vsz : vsz
                }));
                response.end();
            });
            break;
        case "/done":
            //TODO: kill browser process and stop listening? or maybe just don't worry about it for now...
            response.writeHead(200);
            response.end();
            break;
        default:
            console.log("serving up file");
            request.addListener('end', function () {
                file.serve(request, response);
            });
            break;
    }
}).listen(8080);


var browserName = "firefox";
var browserProc = spawn(browserName,["http://localhost:8080/run-tests.html"]);


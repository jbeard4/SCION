var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    url = require('url'),
    st = require('node-static'); //static file server

var staticFileServerCwd = new st.Server(process.cwd()),
    staticFileServerScriptDir = new st.Server(__dirname);

http.createServer(function (req, res) {
    var reqUrl = url.parse(req.url);
    req.addListener('end', function () {
        fs.exists(path.join(__dirname,reqUrl.pathname),function(exists){
            if(exists){
                staticFileServerScriptDir.serve(req, res);
            }else{
                fs.exists(path.join(process.cwd(),reqUrl.pathname),function(exists){
                    if(exists){
                        staticFileServerCwd.serve(req, res);
                    }else{
                        //return 404
                        res.writeHead(404, {'Content-Type': 'text/plain'});
                        res.end('File not found\n');
                    }
                });
            } 
        });
    });
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

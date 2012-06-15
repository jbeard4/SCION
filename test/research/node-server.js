var Static = require('node-static');
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var common = require('./common');
var http = require('http');

var file = new Static.Server('.');

//start up the browser as a child process
//save his pid


var testDescriptors = [];


//TODO: get tests and groups
var testRoot = "tests/generated";
var testGroupsNames = fs.readdirSync(testRoot);

function getTestGroups(){
    var testGroups = [];
    testGroupsNames.sort().forEach(function(groupName){
        testGroups.push({
            groupName : groupName,
            testNames : fs.readdirSync(path.join(testRoot,groupName)).filter(function(f){return f.search(/\.scxml$/) > -1;}).sort(),
            tests : []
        });
    }); 

    testGroups.forEach(function(testGroup){
        console.log(testGroup.groupName);
        testGroup.testNames.forEach(function(testName){
            console.log(testName);
            common.transitionSelectors.forEach(function(transitionSelector){
                common.setTypes.forEach(function(setType){
                    common.extraModelInfo.forEach(function(modelInfo){ 
                        common.flattened.forEach(function(flat){
                            var testScxmlUrl = path.join((flat ? "/tests/flattened/generated" : "/" + testRoot),   //TODO: transform in-browser
                                                    testGroup.groupName,testName);
                            testGroup.tests.push({
                                testScxmlUrl : testScxmlUrl,
                                testScriptUrl : testScxmlUrl.split(".")[0] + ".json",
                                transitionSelector : transitionSelector,
                                setType : setType,
                                extraModelInfo : modelInfo,
                                flattened : flat
                            }); 
                        }); 
                    });
                }); 
            });
        });
    });

    return testGroups;
}

//TODO: loop repeatedly. run in other browsers.
var testGroups = getTestGroups();

var numTests = testGroups.reduce(function(a,b){return a.tests.length + b.tests.length}); 
console.log("Preparing to run " + numTests  + " tests.");

var fileCount = 0;


var currentTest;
var currentGroup;

var browserName = "firefox";
var browserProc;

function startBrowser(){
    console.log("starting browser");
    browserProc = spawn(browserName,["http://localhost:8080/run-tests.html"]);
}

var server = http.createServer(function (request, response) {
    console.log("received request",request.url);
    switch(request.url){
        case "/test-please":
            if(!currentGroup){  //we've just started up - our first request
                currentGroup = testGroups.shift();
            }

            currentTest = currentGroup.tests.shift();
            if(!currentTest){   //we're at the end of this group's tests
                currentGroup = testGroups.shift();
                console.log("starting new group",currentGroup.group);
                currentTest = currentGroup.tests.shift();
            } 

            console.log("sending test to client",currentTest);
            response.writeHead(200);
            response.write(JSON.stringify(currentTest));
            response.end();
            break;
        case "/result":

            var s = "";
            request.on("data",function(data){
                s += data;
            });
            request.on("end",function(){
                var result = JSON.parse(s);
                currentTest.result = result;

                //dump the test result to disk... or direct to database?
                fs.writeFile( "data/" + browserName + "/" + (fileCount++) + ".json", JSON.stringify(currentTest,4,4), "utf8",function(err){
                    if(err){
                        throw err;
                        return
                    }

                    //kill and restart the browser
                    if(!currentGroup.tests.length){
                        //if that was our last test in this group, kill the browser and start him up again
                        console.log("killing browser");
                        browserProc.kill();

                        browserProc.on("exit",function(){
                            if(response) response.end();
                            if(testGroups.length){
                                //start up browser again
                                startBrowser();
                            }else{
                                console.log("that's all... wrapping up");
                                //if that was our last test in our last group, then we're done, stop listening, and terminate gracefully
                                server.close();
                            }
                        });
                    }else{
                        //otherwise, reply that everything is OK.
                        response.writeHead(200);
                    }

                    response.end();
                });
            });
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
        default:
            console.log("serving up file");
            request.addListener('end', function () {
                file.serve(request, response);
            });
            break;
    }
}).listen(8080);

startBrowser();

//chromium --disable-hang-monitor 
//as chromium is multiprocess, it might be difficult to kill... we'll have to see.
//webkit

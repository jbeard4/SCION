var Static = require('node-static');
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var common = require('./common');
var http = require('http');
var mongo = require('mongodb');

var file = new Static.Server('.');

var mongoClient = new mongo.Db('scion', new mongo.Server("127.0.0.1", 27017, {}));

//start up the browser as a child process
//save his pid


var testDescriptors = [];


//TODO: get tests and groups
var testRoot = "tests/generated";
var testGroupsNames = fs.readdirSync(testRoot);

function getTestGroups(){
    var testGroups = [];

    common.browsers.forEach(function(browser){ 
        testGroupsNames.sort().forEach(function(groupName){
            testGroups.push({
                browser : browser,
                groupName : groupName,
                testNames : fs.readdirSync(path.join(testRoot,groupName)).
                                map(function(f){return f.match(/(.*)\.scxml$/);}).
                                filter(function(m){return m;}).
                                map(function(m){return m[1];}).
                                sort(),
                tests : []
            });
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
                            var groupPath = path.join((flat ? "/tests/flattened/generated" : "/" + testRoot),   //TODO: transform in-browser
                                                    testGroup.groupName);

                            var testScxmlUrl = path.join(groupPath,testName + ".scxml"); 
                            var testScriptUrl = path.join(groupPath,testName + ".json"); 

                            testGroup.tests.push({
                                group : testGroup.groupName,
                                name : parseInt(testName,10),
                                browser : testGroup.browser,
                                testScxmlUrl : testScxmlUrl,
                                testScriptUrl : testScriptUrl, 
                                transitionSelector : transitionSelector,
                                setType : setType,
                                extraModelInfo : modelInfo,
                                flattened : flat
                            }); 
                        }); 
                    });
                }); 
            })
        });
    });

    return testGroups;
}

//TODO: loop repeatedly. run in other browsers.
var testGroups = getTestGroups();

var numTests = testGroups.reduce(function(a,b){return a + b.tests.length},0); 
console.log("Preparing to run " + numTests  + " tests.");

var fileCount = 0;


var currentTest;
var currentGroup;

var browserProc;

function startBrowser(browserName){
    console.log("starting browser");
    var args = ["http://localhost:8080/run-tests.html"];
    if(browserName === 'chromium'){
        args = ['--disable-hang-monitor'].concat(args);
    }else if(browserName === 'firefox'){
        args = ['-P','performance testing','-no-remote'].concat(args);
    }
    console.log(browserName,args);
    browserProc = spawn(browserName,args);
}

function startServer(err,collection){
    if(err){
        throw err;
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
                    console.log("inserting results into mongodb");
                    collection.insert(currentTest, function(err, docs) {
                        console.log("results inserted");

                        if(err){
                            console.log("error inserting doc",err);
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
                                    startBrowser(testGroups[0].browser);
                                }else{
                                    console.log("that's all folks... wrapping up");
                                    //if that was our last test in our last group, then we're done, stop listening, and terminate gracefully
                                    mongoClient.close();
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

    startBrowser(testGroups[0].browser);   //kick him off
}



mongoClient.open(function(err, p_client) {
  mongoClient.collection('runs', startServer);
});


//specify on the command-line tests to run...scxml files?

//read tests from filesystem

//run in two modes: parallel and serial

//specify test-server to communicate with

//client-server protocol:
//send sc to load; initial configuration returned in the response, along with id token. compare
//send event and id token; return new configuration; compare
//when done, send "done" event so server can optionally clean up.

//do the simplest thing first: run sequentially

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    request = require('request'),
    assert = require('assert'),
    nopt = require('nopt'),
    Static = require('node-static'),
    http = require('http'),
    urlModule = require('url'),
    pathModule = require('path'),
    Table = require('cli-table'),
    issueHandler = require('./issue-handler.js').issueHandler,
    knownOpts = { 
        "parallel" : Boolean,
        "test-server-url" : String,
        "file-server-port" : Number,
        "file-server-host" : String,
        "verbose" : Boolean,
        "report" : String,
        "issues" : Boolean,
        "legacySemantics" : Boolean
    },
    shortHands = { 
        "p" : "--parallel",
        "t" : "--test-server-url",
        "f" : "--file-server-port",
        "h" : "--file-server-host",
        "v" : "--verbose",
        "r" : "--report",
        "i" : "--issues",
        "l" : "--legacy-semantics"
    };

function testPair(pair,done){
    var testName = pair[0], scxml = pair[1], testJson = pair[2], sessionToken, event;

    if(parsed.legacySemantics && testJson.legacySemantics){
      testJson = testJson.legacySemantics;
    } 

    function handleResponse(error, response, body){
        if(error || response.statusCode !== 200){
            handleErrorResponse(error, response, body);
            return;
        }

        try{
            assert.deepEqual(
                body.nextConfiguration.sort(),
                ( ((typeof sessionToken !== 'undefined') && event) ? event.nextConfiguration : testJson.initialConfiguration).sort());
        }catch(e){
            console.log("\x1b[35mFailed\x1b[0m: " + testName);

            if(verbose) {
                console.error(e);
            }
            
            if(issues) {
                issueHandler.createIssue(pair, 'fail', body, e);
            }

            testsFailed++;

            testResults.push({ name: testName, result: 'fail', error: e, data: body });

            done();
            return;
        }

        if((typeof body.sessionToken !== 'undefined') && (typeof sessionToken === 'undefined')){
            sessionToken = body.sessionToken;   //we send this along with all subsequent requests
        }

        sendEvent();
    }

    /**
     * Determine if the error was expected in which case treat it as success;
     *   otherwise, report failure
     * @param  {object} [error]  The HTTP error
     * @param  {object} [response] The HTTP response
     * @param  {string} [body] The HTTP response body
     */
    function handleErrorResponse(error, response, body) {
        var expected = true;
        var err;

        if (testJson.error) {
            if (testJson.error.statusCode) {
                var actualStatus = (response ? response.statusCode : undefined);
                if (testJson.error.statusCode !== actualStatus) {
                    err = 'unexpected statusCode ' + actualStatus;
                    expected = false;
                }
            }

            if (testJson.error.bodyRegExp) {
                var rx = new RegExp(testJson.error.bodyRegExp, 'i');
                if (!body || !rx.test(body)) {
                    err = 'unexpected body ' + body;
                    expected = false;
                }
            }
        } else {
            err = 'unexpected error';
            expected = false;
        }

        if (expected) {
            console.log("\x1b[32mPassed\x1b[0m: " + testName);
            testsPassed++;
            testResults.push({ name: testName, result: 'pass', error: null, data: null });
        } else {
            console.log("\x1b[31mError\x1b[0m:  " + testName);

            if(verbose) {
                console.error(error, body);
            }

            testResults.push({ name: testName, result: 'error', error: err, data: body });

            if(issues) {
                issueHandler.createIssue(pair, 'error', body, error);
            }

            testsErrored++;
        }

        done();
    }

    //send scxml
    var loadUrl = urlModule.format({
        protocol : 'http:',
        hostname : fileServerHost,
        port:fileServerPort,
        pathname : scxml
    });

    if(verbose) {
        console.log("loading",testName,loadUrl);
    }

    request.post( { 
        url : testServerUrl, 
        json : { 
            load : loadUrl 
        } 
    }, handleResponse);

    //send events until there are no more events
    function sendEvent(){
        event = testJson.events.shift();
        if(event){
            function doSend(){

                if(verbose) {
                    console.log("sending event",event.event);
                }
                
                request.post(
                    {
                        url : testServerUrl,
                        json : {
                            event : event.event,
                            sessionToken : sessionToken 
                        }
                    },
                    handleResponse);
            }

            if(event.after){
                if(verbose) {
                    console.log("waiting to send",event.after);
                }
                setTimeout(doSend,event.after);
            }else{
                doSend();
            }
        }else{
            console.log("\x1b[32mPassed\x1b[0m: " + testName);

            testsPassed++;

            testResults.push({ name: testName, result: 'pass', error: null, data: null });

            done();
        }
    }
}

function complete(cb){
    //stop serving files
    fileServer.close();

    console.log("TEST RESULTS");
    console.log("\x1b[32mPassed: " + testsPassed + "\x1b[0m, \x1b[31mError: " + testsErrored + "\x1b[0m, \x1b[35mFailed: " + testsFailed + "\x1b[0m");

    if(report === "html") {
        generate_html_report(testResults, done);
    } else if(report === "console") {
        generate_console_report(testResults, done);
    }

    cb();
}

function done(){
  //print summary
  console.log("TEST RESULTS");
  console.log("\x1b[32mPassed: " + testsPassed + "\x1b[0m, \x1b[31mError: " + testsErrored + "\x1b[0m, \x1b[35mFailed: " + testsFailed + "\x1b[0m");
  
  console.log('exit status',testsErrored + testsFailed);
  process.exit(testsErrored + testsFailed);   
}

function generate_html_report (results, report_done) {
    var all_html = "<!doctype html><html><body><h1>Test Results</h1>";

    all_html += "<h3>Summary</h3><p>NodeJs Version: " + process.version + " - " + new Date() + "<p>";

    all_html += "<p>Passed: " + testsPassed + ", Error: " + testsErrored + ", Failed: " + testsFailed + "</p>";

    all_html += "<h3>Tests</h3><table border='1'><tr><td>Name</td><td>Result</td><td>Error</td><td>Data</td></tr>";

    for (var i = testResults.length - 1; i >= 0; i--) {

        all_html += "<tr><td>" + testResults[i].name + "</td><td>" + testResults[i].result + "</td><td>" + testResults[i].error + "</td><td>" + JSON.stringify(testResults[i].data) + "</td></tr>";
        
    };

    all_html += "</body></html>";

    var date_filename = new Date().getTime();

    fs.writeFile("Report " + date_filename + ".html", all_html, function(err) {
        if(err) {
            console.log('Error creating report');
            console.log(err);
            report_done();
        } else {
            console.log("Report is created at /reports/" + date_filename);
            report_done();
        }
    }); 
}

function generate_console_report (results, report_done) {
    console.log('generating console report');

    var table = new Table({
        head: ['Name', 'Result', 'Error']
        ,colWidths: [60, 7, 62]
        // ,style : {compact : true}
    });

    for (var i = results.length - 1; i >= 0; i--) {
        var newItem = [
            (results[i].name || '').replace('scxml-test-framework/test/', ''),
            results[i].result || '',
            results[i].error || ''
            // ,JSON.stringify(results[i].data || '')
        ];
        table.push(newItem);
    };

    console.log(table.toString());
    console.log('generated console report');

    report_done();
}

function start_tests (cb) {
    if(parallel){
        //run in parallel
        function done(){
            if((testResults.length) === scxmlTestFiles.length) complete(cb);
        }
        testPairs.forEach(function(pair){testPair(pair,done);});
    }else {
        //run sequentially
        (function(pair){
            if(pair){
                var f = arguments.callee;
                var nextStep = function(){ f(testPairs.pop()); };
                testPair(pair,nextStep); 
            }else{
                //we're done
                complete(cb);
            }
        })(testPairs.pop());
    }
}



/* 
 * file-server-port
 *   default : 9999
 * file-server-host
 *   default: 'localhost'
 * cwd

 * test-server-url
 *   default : "http://localhost:42000/";
 * parallel
 * verbose
 * report
 * issues
 * scxmlTestFiles
**/


var fileServerPort,
  fileServerHost,
  cwd,
  testServerUrl,
  parallel,
  verbose,
  report,
  issues,
  scxmlTestFiles;

var testsPassed, testsFailed, testsErrored, testResults;

var testJson, testPairs, testsPassed; //members  
var parsed;

function startTests(_parsed, cb){
  parsed = _parsed;

  fileServerPort = parsed['file-server-port'] || 9999;
  fileServerHost = parsed['file-server-host'] || 'localhost';

  cwd = process.cwd();

  //start serving files
  file = new Static.Server(cwd);
  fileServer = http.createServer(function (request, response) {
      request.addListener('end', function () {
          file.serve(request, response);
      }).resume();
  });
  fileServer.listen(fileServerPort);
  console.log('File server listing on ',fileServerPort);

  //run tests
  testServerUrl = parsed["test-server-url"] || "http://localhost:42000/";
  parallel = parsed.parallel;
  verbose = parsed.verbose;
  report = parsed.report;
  issues = parsed.issues;
  scxmlTestFiles = parsed.argv ? parsed.argv.remain : parsed.scxmlTestFiles;

  //TODO: if scxmlTestFiles is empty, get all files ../test/*/*.scxml

  testJson = scxmlTestFiles.map(function(s){return path.join(path.dirname(s),path.basename(s,'.scxml') + '.json');}).
                  map(function(f){return fs.readFileSync(f,'utf8');}).map(JSON.parse);
  testPairs = _.zip(scxmlTestFiles,scxmlTestFiles,testJson);

  testsPassed = 0; 
  testsFailed = 0; 
  testsErrored = 0; 
  testResults = [];

  start_tests(cb);
}

if(require.main === module){
  var parsed = nopt(knownOpts, shortHands);
  startTests(parsed, function(){ console.log('done'); });
}

module.exports = startTests;

/*
if(issues) {
    issueHandler.getIssues(function (issueList) {
        start_tests();
    });
} else {
    start_tests();
}
*/

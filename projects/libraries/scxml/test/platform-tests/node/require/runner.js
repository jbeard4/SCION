var scxml = require('../../../../');
var platform = scxml.ext.platform;

function testModel(model, test){
    console.log('here 2',scxml);
    var sc = new scxml.scion.Statechart(model);
    var initialConfig = sc.start();

    test.deepEqual(initialConfig,['a'],'initial configuration');

    var nextConfig = sc.gen("t");

    test.deepEqual(nextConfig,['b'],'next configuration');

    console.log("nextConfig",nextConfig);

    test.done();
}

exports.testPathToModel = function(test){
    var docPath = __dirname + '/test.scxml';
    var execContext = platform.module.createLocalExecutionContext(docPath);
    scxml.pathToModel(docPath, function(err,model){
        console.log('here 1',scxml);
        model.prepare(function(err, fnModel) {
            testModel(fnModel, test);
        }, execContext);
    });
};

function testBundle(model, test){
    var sc = new scxml.scion.Statechart(model);
    var initialConfig = sc.start();

    test.deepEqual(initialConfig,['a'],'initial configuration');

    var nextConfig = sc.gen("t");

    test.deepEqual(nextConfig,['p'],'next configuration');

    console.log("nextConfig",nextConfig);

    test.done();
}

exports.testBundle = function(test) {    
    var docPath = __dirname + '/bundle.scxml';
    var execContext = platform.module.createLocalExecutionContext(docPath);
    scxml.pathToModel(docPath,function(err,model){
        model.prepare(function(err, fnModel) {
            testBundle(fnModel, test);
        }, execContext);   
    }, {reportAllErrors: true});    
}

var scxml = require('../../../../');
var pm = scxml.ext.platformModule.platform;

function testModel(model, test){
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
    var execContext = pm.module.createLocalExecutionContext(docPath);
    scxml.pathToModel(docPath, function(err,model){
        model.prepare(execContext, function(err, fnModel) {
            testModel(fnModel, test);
        });
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
    var execContext = pm.module.createLocalExecutionContext(docPath);
    scxml.pathToModel(docPath,function(err,model){
        model.prepare(execContext, function(err, fnModel) {
            testBundle(fnModel, test);
        });   
    }, {reportAllErrors: true});    
}

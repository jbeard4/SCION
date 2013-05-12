var scxml = require('../../../');

function testModel(modelFactory, test){
    var model = modelFactory();
    var sc = new scxml.scion.Statechart(model);
    var initialConfig = sc.start();

    test.deepEqual(initialConfig,['a'],'initial configuration');

    var nextConfig = sc.gen("t");

    test.deepEqual(nextConfig,['b'],'next configuration');

    console.log("nextConfig",nextConfig);

    test.done();
}

exports.testPathToModel = function(test){
    scxml.pathToModelFactory(__dirname + '/require/test.scxml',function(err,modelFactory){
        if(err) throw err;
        testModel(modelFactory,test);
    });
};

exports.testRequireExtension = function(test){
    var modelFactory = require('./require/test');
    console.log('modelFactory',modelFactory.toString());
    testModel(modelFactory,test);
};

//exports.testRequireExtension(require('assert'));

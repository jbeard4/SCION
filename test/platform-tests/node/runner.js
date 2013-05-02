var scxml = require('scxml');

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
    scxml.pathToModel(__dirname + '/require/test.scxml',function(err,model){
        if(err) throw err;
        testModel(model,test);
    });
};

exports.testRequireExtension = function(test){
    var model = require('./require/test');
    console.log('model',model);
    testModel(model,test);
};

//exports.testRequireExtension(require('assert'));

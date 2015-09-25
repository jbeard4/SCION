var scxml = require('../../../../');

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
    scxml.pathToModel(__dirname + '/test.scxml',function(err,model){
        testModel(model,test);
    });
};

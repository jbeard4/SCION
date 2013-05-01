var scxml = require('scxml');

scxml.pathToModel('require/require.scxml',function(err,model){
    if(err) throw err;

    var scxml = new scxml.scion.Statechart(model);
    var initialConfig = scxml.start();
    console.log("initialConfig",initialConfig);
    var nextConfig = scxml.gen("t");
    console.log("nextConfig",nextConfig);
});

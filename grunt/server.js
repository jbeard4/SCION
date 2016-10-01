var express = require('express');
var app     = module.exports = express();
var env     = process.env.NODE_ENV || 'development';

express.static.mime.define({'application/scxml+xml': ['scxml']});

app.set('port', process.env.PORT || 3000);

var testPairs = require('scion/grunt/test-pairs.js'); 

app.get('/scxml-tests', function(req, res){
  return res.json(testPairs); 
});
app.use('/', express.static(__dirname + '/..'));

module.exports = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


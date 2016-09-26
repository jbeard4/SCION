var express = require('express');
var app     = module.exports = express();
var env     = process.env.NODE_ENV || 'development';

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(__dirname + '/..'));

module.exports = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

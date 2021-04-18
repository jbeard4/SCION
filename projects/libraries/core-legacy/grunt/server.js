var path    = require('path');
var express = require('express');
var app     = module.exports = express();
var env     = process.env.NODE_ENV || 'development';

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
var browserHarness = path.join(path.dirname(require.resolve('scion-core-test-framework')), '/../browser');
app.set('views', browserHarness + '/views');

app.get('/', function(req, res) {
  res.render('harness.ejs', {env : env});
});

app.use('/', express.static(browserHarness));
app.use('/', express.static(__dirname + '/..'));

module.exports = app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

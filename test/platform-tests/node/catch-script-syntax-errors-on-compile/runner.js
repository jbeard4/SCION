var scxml = require('../../../..');

module.exports = {
  testErrorSurfaced: testErrorSurfaced,
  testErrorSuppressed: testErrorSuppressed
}

function testErrorSurfaced(test) {
  scxml.pathToModel(__dirname + '/bad.scxml', function(err, model) {
    if(!err) {
        throw 'expected compile error to be returned';
    }

    if (model) {
        throw 'unexpected model due to compile error';        
    }

    test.done();
  }, 
  {
    reportAllErrors: true
  });
}

function testErrorSuppressed(test) {
  scxml.pathToModel(__dirname + '/bad.scxml', function(err, model) {
    if (err) {
        throw 'expected compile error to be suppressed';
    }

    if (!model) {
        throw 'expected model to be returned';        
    }

    test.done();
  });    
}
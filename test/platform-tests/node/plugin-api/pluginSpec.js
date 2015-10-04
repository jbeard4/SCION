var scxml = require('../../../..');
var _ = require('underscore');

describe("Custom action elements", function(){

  beforeEach(function(){
    this.addMatchers({
        toDeepEqual: function(expected) {
            return _.isEqual(this.actual, expected);
        }
    });
  });

  it("works for registering custom elements", function(){

    var x = 1;
    var runtimeTest = {
      customRuntimeCb1 : function (){console.log('x1',x++)},
      customRuntimeCb2 : function (){console.log('x2',x++)},
      customRuntimeCb3 : function (){console.log('x3',x++)}
    };

    var compileTest = {
      "foo" : function(action){ 
        expect(action).toDeepEqual({
          $line : 11 , 
          $column : 28, 
          $type : '{http://scion.io}foo', 
          alpha : '0'  
        });

        return 'customRuntimeCb1(' + JSON.stringify(action.alpha) + ');';
      },
      "bar" : function(action){ 
        expect(action).toDeepEqual({ 
          '$line': 14,
          '$column': 33,
          '$type': '{http://scion.io}bar',
          betaexpr: { '$line': 14, '$column': 33, expr: 'i++' } });
        return 'customRuntimeCb2(' + action.betaexpr.expr + ');';
      },
      "bat" : function(action){ 
        
        expect(action).toDeepEqual({ 
          '$line': 17,
          '$column': 40,
          '$type': '{http://scion.io}bat',
          '{http://scion.io}deltaexpr': { 
            '$line': 17, 
            '$column': 40, 
            expr: 'i++' 
          } 
        });
        return 'customRuntimeCb3(' + action['{http://scion.io}deltaexpr'].expr + ');';
      }
    };

    var plugin = {
      "http://scion.io" : compileTest
    };

    //spyOn(compileTest, 'foo').andCallThrough();
    //spyOn(compileTest, 'bar').andCallThrough();
    //spyOn(compileTest, 'bat').andCallThrough();

    spyOn(runtimeTest, 'customRuntimeCb1');
    spyOn(runtimeTest, 'customRuntimeCb2');
    spyOn(runtimeTest, 'customRuntimeCb3');

    var flag = false;
    waitsFor(function() {
      return flag;
    }, "wait", 750);

    scxml.pathToModel(__dirname + '/plugin.scxml', function(err, model) {

      expect(err).toBeNull();

      var sc = new scxml.scion.Statechart(model);
      var initialConfig = sc.start();

      expect(initialConfig).toEqual(['a']);

      var nextConfig = sc.gen("t");

      expect(nextConfig,['b']);

      expect(runtimeTest.customRuntimeCb1).toHaveBeenCalledWith('0');
      expect(runtimeTest.customRuntimeCb2).toHaveBeenCalledWith(1);
      expect(runtimeTest.customRuntimeCb3).toHaveBeenCalledWith(2);

      flag = true;
    }, 
    {
      customActionElements : plugin,
      customRuntimeGlobals : runtimeTest
    });
  });
});

//TODO: test compiler syntax error. Ensure that error propagates.

//TODO: test runtime errors. Expect error.execution to be thrown

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

    var runtimeTest = {
      customRuntimeCb1 : function (){},
      customRuntimeCb2 : function (){},
      customRuntimeCb3 : function (){}
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

  //TODO: test compiler syntax error. Ensure that error propagates.
  it("propagates syntax error in model through",function(){

    var compileTest = {
      "foo" : function(action){ 
        return '*/+-_';      //syntax error in compiled module
      },
      "bar" : function(action){ return ""; },
      "bat" : function(action){ return ""; }
    };

    var plugin = {
      "http://scion.io" : compileTest
    };

    var flag = false;
    waitsFor(function() {
      return flag;
    }, "wait", 750);

    scxml.pathToModel(__dirname + '/plugin.scxml', function(err, model) {
      expect(err).not.toBeNull();
      expect(err.name).toBe('SyntaxError');

      flag = true;
    }, 
    {
      customActionElements : plugin
    });
  });

  it("propagates compiler error through",function(){
    var compileTest = {
      "foo" : function(action){ 
        throw new Error('foo');
      },
      "bar" : function(action){ return ""; },
      "bat" : function(action){ return ""; }
    };

    var plugin = {
      "http://scion.io" : compileTest
    };

    var flag = false;
    waitsFor(function() {
      return flag;
    }, "wait", 750);

    scxml.pathToModel(__dirname + '/plugin.scxml', function(err, model) {
      expect(err).not.toBeNull();
      expect(err.message).toBe('foo');

      flag = true;
    }, 
    {
      customActionElements : plugin
    });
  });

  it("propagates catch undefined action element",function(){
    var compileTest = {
      "foo" : function(action){ return ""; },
      "bar" : function(action){ return ""; },
      //"bat" : function(action){ return ""; }    //bat is not defined
    };

    var plugin = {
      "http://scion.io" : compileTest
    };

    var flag = false;
    waitsFor(function() {
      return flag;
    }, "wait", 750);

    scxml.pathToModel(__dirname + '/plugin.scxml', function(err, model) {

      expect(err).not.toBeNull();
      //expect(err.message).toBe('foo');

      flag = true;
    }, 
    {
      customActionElements : plugin
    });
  });

  it("handle return undefined from custom action code",function(){
    var compileTest = {
      "foo" : function(action){ },
      "bar" : function(action){ },
      "bat" : function(action){ }
    };

    var plugin = {
      "http://scion.io" : compileTest
    };

    var flag = false;
    waitsFor(function() {
      return flag;
    }, "wait", 750);

    scxml.pathToModel(__dirname + '/plugin.scxml', function(err, model) {

      expect(err).not.toBeNull();
      expect(err.message).toBe('Undefined function template');

      flag = true;
    }, 
    {
      customActionElements : plugin
    });
  });

  //TODO: test runtime errors. Expect error.execution to be thrown
  it("dispatches error.execution on runtime error",function(){

    var runtimeTest = {
      customRuntimeCb1 : function (){throw new Error('foo')},
    };

    var compileTest = {
      "foo" : function(action){ 
        return 'customRuntimeCb1();';
      },
      "bar" : function(action){ return ""; },
      "bat" : function(action){ return ""; }    //bat is not defined
    };

    var plugin = {
      "http://scion.io" : compileTest
    };

    var flag = false;
    waitsFor(function() {
      return flag;
    }, "wait", 750);

    scxml.pathToModel(__dirname + '/plugin.scxml', function(err, model) {

      expect(err).toBeNull();

      var sc = new scxml.scion.Statechart(model);
    
      var listeners = {
        onEntry : function(stateId){
          if(stateId === 'c'){
            flag = true;
          }
        }
      };
      sc.on('onEntry',listeners.onEntry);

      var initialConfig = sc.start();

      expect(initialConfig).toEqual(['c']);
    }, 
    {
      customActionElements : plugin,
      customRuntimeGlobals : runtimeTest
    });
  });

});

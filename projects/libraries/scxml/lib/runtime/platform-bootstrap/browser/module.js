"use strict";

const vm = require('vm');

module.exports = {

  eval: function(s,fileName,context){

      context = context || {};
      fileName = fileName || '';

      var sandbox = {};
      sandbox.global = sandbox;
      var ctx = vm.createContext(sandbox);

      return vm.runInContext(s,ctx,fileName);
  },

  createLocalExecutionContext : function(docPath, sandbox) {
      if (!sandbox) {
          sandbox = {console: console};
          sandbox.global = sandbox;
      }

      var ctx = vm.createContext(sandbox);

      return ctx;
  }
};

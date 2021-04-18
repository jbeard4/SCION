"use strict";

const Module = require('module'),
    pathModule = require('path'),
    vm = require('vm');

module.exports = {
  eval: function(s,fileName,context){

      context = context || {};
      fileName = fileName || '';

      //TODO: if filename starts with 'http', substitute a default require

      // https://247inc.atlassian.net/browse/OMNI-3
      // create an isolated sandbox per session
      var sandbox = {};
      sandbox.global = sandbox;
      var ctx = vm.createContext(sandbox);

      if(context.isLoadedFromFile){
          ctx.__filename = fileName;
          ctx.__dirname = pathModule.dirname(ctx.__filename);

          //set it up so that require is relative to file
          var _module = ctx.module = new Module(fileName);
          var _require = ctx.require = function(path) {
              return Module._load(path, _module, true);
          };
          _module.filename = ctx.__filename;
          _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
          _require.resolve = function(request) {
              return Module._resolveFilename(request, _module);
          };

      }else{
          //otherwise (e.g., loaded via http, or from document string), choose a sensible default
          ctx.require =
              context.require ||                      //user-specified require
                  (require.main &&                    //main module's require
                      require.main.require &&
                      require.main.require.bind(require.main)) ||
                  require;                            //this module's require
      }

      //set up default require and module.exports
      return vm.runInContext(s,ctx,fileName);
  },

  createLocalExecutionContext : function(docPath, sandbox) {
      if (!sandbox) {
          sandbox = {console: console};
          sandbox.global = sandbox;
      }

      var ctx = vm.createContext(sandbox);

      ctx.__filename = docPath;
      ctx.__dirname = pathModule.dirname(ctx.__filename);

      //set it up so that require is relative to file
      var _module = ctx.module = new Module(docPath);
      var _require = ctx.require = function(path) {
          return Module._load(path, _module, true);
      };
      _module.filename = ctx.__filename;
      _require.paths = _module.paths = Module._nodeModulePaths(process.cwd());
      _require.resolve = function(request) {
          return Module._resolveFilename(request, _module);
      };

      return ctx;
  }
};


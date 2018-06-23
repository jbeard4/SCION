import { ModelFactory, SCState } from 'scion-core';
import _scion = require('scion-core');

export interface ModelFactoryFactory {
  /**
    Prepare the model by recursively downloading external scripts referenced by
    script/@src, and SCXML documents references by invoke/@src, then constructing a
    host execution context for the SCXML datamodel.
  **/
  prepare : (cb : (err : Error, modelFactory : ModelFactory) => any, executionContext? : any, hostContext? : any) => void;
}

export function urlToModel(url : string, cb : (err : Error, modelFactoryFactory : ModelFactoryFactory) => any, context? : any);

export function pathToModel(url : string, cb : (err : Error, modelFactoryFactory : ModelFactoryFactory) => any, context? : any);

export function documentStringToModel(url : string, scxmlDocString : string, cb : (err : Error, modelFactoryFactory : ModelFactoryFactory) => any, context? : any);

export namespace ext {
  export namespace compilerInternals {
    export const scxmlToScjson : (scxmlContents : string) => SCState;
  }
}

export var scion: typeof _scion;

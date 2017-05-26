/// <reference types="scion-core" />

import * as scion from 'scion-core';

export interface SCModel {
  prepare : (cb : (err : Error, fnModel : scion.FnModel) => any, executionContext? : any, hostContext? : any) => void;
}

export function urlToModel(url : string, cb : (err : Error, model : SCModel) => any, context? : any);
export function pathToModel(url : string, cb : (err : Error, model : SCModel) => any, context? : any);
export namespace ext {
  export namespace compilerInternals {
    export const scxmlToScjson : (scxmlContents : string) => scion.SCState;
  }
}

export { scion }

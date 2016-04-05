var pm = require('../platform'),
    platform = require('./platform'),
    facade = require('../../facade'),
    scion = require('scion-core');

pm.platform = platform;     //setup platform

//TODO: patch SCION, e.g. with custom <send> implementation

//TODO: expose parts of the compiler that we want to allow patching

facade.scion = scion;       //extend facade. TODO: mixin better? 

module.exports = facade;

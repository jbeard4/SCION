//     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors
//
//     Licensed under the Apache License, Version 2.0 (the "License");
//     you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
//             http://www.apache.org/licenses/LICENSE-2.0
//
//     Unless required by applicable law or agreed to in writing, software
//     distributed under the License is distributed on an "AS IS" BASIS,
//     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
//     limitations under the License.

var _ = require('../../util/underscore-wrapper');

module.exports = function(l) {
    l = l || [];
    this.o = [];
        
    _.forEach(l,_.bind(function(x){
        this.add(x);
    },this));
};

//TODO: delegate to underscore's union and difference
module.exports.prototype = {

    add : function(x) {
        if (!this.contains(x)) return this.o.push(x);
    },

    remove : function(x) {
        var i = _.indexOf(this.o,x);
        if(i === -1){
            return false;
        }else{
            this.o.splice(i, 1);
        }
        return true;
    },

    union : function(l) {
        l = l.iter ? l.iter() : l;
        _.forEach(l,_.bind(function(x){
            this.add(x);
        },this));
        return this;
    },

    difference : function(l) {
        l = l.iter ? l.iter() : l;

        _.forEach(l,_.bind(function(x){
            this.remove(x);
        },this));
        return this;
    },

    contains : function(x) {
        return _.indexOf(this.o, x) >= 0;
    },

    iter : function() {
        return this.o;
    },

    isEmpty : function() {
        return !this.o.length;
    },

    equals : function(s2) {
        var l2 = s2.iter();

        return _.difference(this.o,l2).length === 0;
    },

    toString : function() {
        return "Set(" + this.o.toString() + ")";
    }
};

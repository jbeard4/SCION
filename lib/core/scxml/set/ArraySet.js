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

"use strict";

/** @constructor */
function ArraySet(l) {
    l = l || [];
    this.o = [];
        
    l.forEach(function(x){
        this.add(x);
    },this);
}

ArraySet.prototype = {

    add : function(x) {
        if (!this.contains(x)) return this.o.push(x);
    },

    remove : function(x) {
        var i = this.o.indexOf(x);
        if(i === -1){
            return false;
        }else{
            this.o.splice(i, 1);
        }
        return true;
    },

    union : function(l) {
        l = l.iter ? l.iter() : l;
        l.forEach(function(x){
            this.add(x);
        },this);
        return this;
    },

    difference : function(l) {
        l = l.iter ? l.iter() : l;

        l.forEach(function(x){
            this.remove(x);
        },this);
        return this;
    },

    contains : function(x) {
        return this.o.indexOf(x) > -1;
    },

    iter : function() {
        return this.o;
    },

    isEmpty : function() {
        return !this.o.length;
    },

    equals : function(s2) {
        var l2 = s2.iter();
        var l1 = this.o;

        return l1.every(function(x){
            return l2.indexOf(x) > -1;
        }) && l2.every(function(x){
            return l1.indexOf(x) > -1;
        });
    },

    toString : function() {
        return "Set(" + this.o.toString() + ")";
    }
};

module.exports = ArraySet;

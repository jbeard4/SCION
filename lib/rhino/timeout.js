/*
     Copyright 2011-2012 Jacob Beard, INFICON, and other SCION contributors

     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at

             http://www.apache.org/licenses/LICENSE-2.0

     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
*/

"use strict";

//set up environment
(function(){
    var counter = 1; 
    var ids = {};
    var timer;
    var activeTasks = 0;

    function cleanUpTimer(){
        activeTasks--; 
        if(activeTasks === 0){
            timer = null;   //clean up timer
        }
    }

    exports.setTimeout = function (fn,delay) {
        var id = counter++;

        activeTasks++; 
        //lazy-init timer
        if(!timer){
            timer = new Packages.java.util.Timer();
        }

        var task = new Packages.java.util.TimerTask({run: function(){
            cleanUpTimer();
            fn();
        }});
        timer.schedule(task,delay);
        ids[id] = task;
        return id;
    };

    exports.clearTimeout = function (id) {
        var task = ids[id];
        task.cancel();
        timer.purge();
        //make sure that we clean up all references to the time so it prevent the program from terminating
        delete ids[id];
        cleanUpTimer();
    };
})();

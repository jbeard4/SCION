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

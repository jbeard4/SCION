//set up environment
(function(){
    var counter = 1; 
    var ids = {};
    var timer = new Packages.java.util.Timer();

    exports.setTimeout = function (fn,delay) {
        var id = counter++;
        var task = new Packages.java.util.TimerTask({run: fn});
        timer.schedule(task,delay);
        ids[id] = {
            timer : timer,
            task : task
        };
        return id;
    };

    exports.clearTimeout = function (id) {
        var o = ids[id],
            timer = o.timer,
            task = o.task;
        task.cancel();
        timer.purge();
        //make sure that we clean up all references to the time so it prevent the program from terminating
        delete o.timer; 
        delete o.task;
        delete ids[id];
    };
})();

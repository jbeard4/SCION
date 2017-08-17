var source = new EventSource('/api/update-stream');

[
  'onExitInterpreter',
  'onBigStepEnd',
  'onSmallStepBegin',
  'onSmallStepEnd',
  'onInvokedSessionInitialized'
].forEach(function(updateName){
  source.addEventListener(updateName, function(e) {
    let message = JSON.parse(e.data);
    console.log(updateName, message);

    dataView.insertItem(0, {
        id : e.lastEventId, 
        name : message.name,
        sessionid : message.sessionid,
        updateName : updateName,
        eventName : message.event && message.event.name
    });


  }, false);
});


var grid,
    data = [],
    columns = [
        { id: "scxmlName", name: "SCXML Name", field: "name", width: 120 },
        { id: "sessionid", name: "Sesssionid", field: "sessionid", width: 120 },
        { id: "updateName", name: "Update", field: "updateName", width: 120 },
        { id: "eventName", name: "Event Name", field: "eventName", width: 120 },
    ],
    options = {
      enableCellNavigation: false,
      enableColumnReorder: false
    };

// Create the DataView.
var dataView = new Slick.Data.DataView();

// Make the grid respond to DataView change events.
dataView.onRowCountChanged.subscribe(function (e, args) {
  grid.updateRowCount();
  grid.render();
});

dataView.onRowsChanged.subscribe(function (e, args) {
  grid.invalidateRows(args.rows);
  grid.render();
});

grid = new Slick.Grid("#container", dataView, columns, options);

dataView.setItems(data);

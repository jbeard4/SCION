const EVENTSOURCE_TIMEOUT = 1000;

function initEventSource(){
  var source = new EventSource('/api/update-stream');

  let previousConfiguration = [],
      statesForDefaultEntry = [],
      currentEvent,
      transitionsEnabled  = new Map();

  source.addEventListener('onSmallStepBegin', function(e) {
    let message = JSON.parse(e.data);
    previousConfiguration = message.snapshot[0];
    transitionsEnabled  = new Map();
    statesForDefaultEntry = [];
    currentEvent = message.event;
  }, false);

  source.addEventListener('onTransition', function(e) {
    let message = JSON.parse(e.data);
    let transitionSourceId, transitionTargetIds, transitionIndex;
    [transitionSourceId, transitionTargetIds, transitionIndex] = message.event;
    let enabledTransitionIndexes;
    if(transitionsEnabled.has(transitionSourceId)){
      enabledTransitionIndexes = transitionsEnabled.get(transitionSourceId)
    } else {
      enabledTransitionIndexes = new Set();
      transitionsEnabled.set(transitionSourceId, enabledTransitionIndexes);
    }
    enabledTransitionIndexes.add(transitionIndex);
  }, false);


  source.addEventListener('onDefaultEntry', function(e) {
    let message = JSON.parse(e.data);
    statesForDefaultEntry.push(message.event);
  });

  source.addEventListener('onSmallStepEnd', function(e) {
    let message = JSON.parse(e.data);

    dataView.insertItem(0, {
        id : e.lastEventId, 
        name : message.name,
        docUrl : message.docUrl,
        sessionid : message.sessionid,
        //updateName : updateName,
        eventName : currentEvent ? currentEvent.name : '<null>',
        snapshot : message.snapshot,
        event : currentEvent,
        parentSessionIds : message.parentSessionIds,
        transitionsEnabled : transitionsEnabled,
        previousConfiguration : previousConfiguration,
        statesForDefaultEntry : statesForDefaultEntry
    });

    grid.setSelectedRows([0]);


  }, false);

  source.onerror = function(err) {
    console.log('sse error',err);
    source.close();
    setTimeout(function(){
      initEventSource();    //restart the event source
    }, EVENTSOURCE_TIMEOUT);
  };
}

var grid,
    data = [],
    columns = [
        { id: "scxmlName", name: "SCXML Name", field: "name", width: 120 },
        //{ id: "docUrl", name: "URL", field: "docUrl", width: 120 },
        { id: "sessionid", name: "Sesssionid", field: "sessionid", width: 120 },
        //{ id: "updateName", name: "Update", field: "updateName", width: 120 },
        { id: "eventName", name: "Event Name", field: "eventName", width: 120 },
    ],
    options = {
      enableCellNavigation: true,
      enableColumnReorder: false
    };

// create the eventEditor
var tabs = $('#tabs').tabs({heightStyle: "fill"});

function initEditor(containerId){
  var editorOptions = { name : 'event', mode : 'view'};
  var container = document.getElementById(containerId);
  var editor = new JSONEditor(container, editorOptions);
  editor.setMode('view');
  return editor;
}

var eventEditor = initEditor("events-tab"),
    snapshotEditor = initEditor("snapshot-tab");

var titleElement = document.getElementById('title');

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

grid = new Slick.Grid("#tableContainer", dataView, columns, options);

grid.setSelectionModel(new Slick.RowSelectionModel());

dataView.setItems(data);

grid.onSelectedRowsChanged.subscribe(function(){
  let rows = grid.getSelectedRows();
  let row = dataView.getItem(rows[0]);

  eventEditor.set(row.event);
  snapshotEditor.set(row.snapshot[3]);

  var precedingRows = dataView.getItems().slice(rows[0] + 1);

  titleElement.innerHTML = row.name + ' [' + row.sessionid+ ']' + 
    row.parentSessionIds.map(function(sessionId){
      //look up name
      var matchingRow;
      for(var i=0; i < precedingRows.length; i++){
        var currentRow = precedingRows[i];
        if(currentRow.sessionid == sessionId){
          matchingRow = currentRow;
          break;
        }
      }

      return ' << ' + matchingRow.name + ' [' + sessionId + ']';    //TODO: look up SCXML info
    }).join('')

  //render the docUrl on the selectedRow
  lazyRenderSchviz(
      row.docUrl,
      row.snapshot,
      row.transitionsEnabled,
      row.previousConfiguration,
      row.statesForDefaultEntry);
})

let schviz;

function lazyRenderSchviz(docUrl,snapshot,transitionsEnabled,previousConfiguration,statesForDefaultEntry){
  $.get('/' + docUrl).then(function(scxmlContents){
    let scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
    schviz = renderSchviz(scjson,snapshot,transitionsEnabled,previousConfiguration,statesForDefaultEntry);
  });
  
}

function renderSchviz(scjson,snapshot,transitionsEnabled,previousConfiguration,statesForDefaultEntry){
  //TODO: cache rendering
  var rootElement = 
    React.createElement(
      SCHVIZ.default,
      {
        scjson:scjson, 
        layoutOptions:SCHVIZ.default.layouts.right,
        configuration:snapshot[0],
        disableAnimation:true,
        transitionsEnabled : transitionsEnabled,
        previousConfiguration : previousConfiguration,
        statesForDefaultEntry : statesForDefaultEntry 
      }
    );

  return ReactDOM.render(
    rootElement,
    document.querySelector('#schvizContainer')
  );

}


initEventSource();

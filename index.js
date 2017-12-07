const EVENTSOURCE_TIMEOUT = 1000;

function initEventSource(){
  var source = new EventSource('/api/update-stream');

  source.addEventListener('onSmallStepEnd', function(e) {
    let message = JSON.parse(e.data);

    //convert message.data.transitionsTaken to a Map
    let transitionsTaken  = new Map();
    message.data.transitionsTaken.forEach( transitionInfo => {
      let transitionSourceId, transitionTargetIds, transitionIndex;
      [transitionSourceId, transitionTargetIds, transitionIndex] = transitionInfo;
      let enabledTransitionIndexes;
      if(transitionsTaken.has(transitionSourceId)){
        enabledTransitionIndexes = transitionsTaken.get(transitionSourceId)
      } else {
        enabledTransitionIndexes = new Set();
        transitionsTaken.set(transitionSourceId, enabledTransitionIndexes);
      }
      enabledTransitionIndexes.add(transitionIndex);
    });

    dataView.insertItem(0, {
        id : e.lastEventId, 
        name : message.meta.scName,
        docUrl : message.meta.docUrl,
        sessionid : message.meta.sessionid,
        eventName : message.data.event ? message.data.event.name : '<null>',
        snapshot : message.meta.snapshot,
        event : message.data.event,
        parentSessionIds : message.meta.parentSessionIds,
        transitionsTaken : transitionsTaken,
        previousConfiguration : message.data.statesExited,
        defaultStatesEntered : message.data.defaultStatesEntered
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
    snapshotEditor = initEditor("snapshot-tab"),
    innerQueueEditor = initEditor("innerqueue-tab");

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

var diffTab = document.getElementById('diff-tab'),
    innerQueueTab = document.getElementById('innerqueue-tab'),
    innerQueueDiffTab = document.getElementById('innerqueue-diff-tab');

grid.onSelectedRowsChanged.subscribe(function(){
  let rows = grid.getSelectedRows();
  let row = dataView.getItem(rows[0]);
  var datamodel = row.snapshot[3];
  var innerQueue = row.snapshot[4];

  var precedingRows = dataView.getItems().slice(rows[0] + 1);

  //look up previous smallstep-row of this sessionid, if it exists
  var previousRow;
  for(var i=0; i < precedingRows.length; i++){
    var currentRow = precedingRows[i];
    if(currentRow.sessionid == row.sessionid){
      previousRow = currentRow;
      break;
    }
  }

  eventEditor.set(row.event);
  snapshotEditor.set(datamodel);
  innerQueueEditor.set(innerQueue); 

  titleElement.innerHTML = row.name + ' [' + row.sessionid+ ']' + 
    row.parentSessionIds.map(function(sessionId){
      return ' << ' + (previousRow ? previousRow.name : '') + ' [' + sessionId + ']';    //TODO: look up SCXML info
    }).join('')

  //render the docUrl on the selectedRow
  lazyRenderSchviz(
      row.docUrl,
      row.snapshot,
      row.transitionsTaken,
      row.previousConfiguration,
      row.defaultStatesEntered);

  //look up previous datamodel
  if(previousRow){
    var prevDatamodel = previousRow.snapshot[3];
    var prevInnerQueue = previousRow.snapshot[4];

    [
      [prevDatamodel, datamodel, diffTab],
      [prevInnerQueue, innerQueue, innerQueueDiffTab]
    ].forEach(function(o){
      var prev = [0], cur = o[1], tab = o[2];
      var delta = jsondiffpatch.diff(prev, cur);
      if(delta){
        tab.innerHTML = jsondiffpatch.formatters.html.format(delta, prev);
      }else{
        tab.innerHTML = 'No change.';
      }
    });
  } else{
    innerQueueDiffTab.innerHTML = diffTab.innerHTML = 'Unable to find previous small-step for session.';
  }

})

let schviz;

function lazyRenderSchviz(docUrl,snapshot,transitionsTaken,previousConfiguration,defaultStatesEntered){
  $.get(docUrl).then(function(scxmlContents){
    let scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
    schviz = renderSchviz(scjson,snapshot,transitionsTaken,previousConfiguration,defaultStatesEntered);
  });
  
}

function renderSchviz(scjson,snapshot,transitionsTaken,previousConfiguration,defaultStatesEntered){
  //TODO: cache rendering
  var rootElement = 
    React.createElement(
      SCHVIZ.default,
      {
        scjson:scjson, 
        layoutOptions:SCHVIZ.default.layouts.right,
        configuration:snapshot[0],
        disableAnimation:true,
        transitionsEnabled : transitionsTaken,
        previousConfiguration : previousConfiguration,
        statesForDefaultEntry : defaultStatesEntered 
      }
    );

  return ReactDOM.render(
    rootElement,
    document.querySelector('#schvizContainer')
  );

}

initEventSource();

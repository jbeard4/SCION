var source = new EventSource('/api/update-stream');

[
  //'onExitInterpreter'
  //,'onBigStepEnd'
  //,'onSmallStepBegin'
  'onSmallStepEnd'
  //,'onInvokedSessionInitialized'
].forEach(function(updateName){
  source.addEventListener(updateName, function(e) {
    let message = JSON.parse(e.data);
    console.log(updateName, message);

    dataView.insertItem(0, {
        id : e.lastEventId, 
        name : message.name,
        docUrl : message.docUrl,
        sessionid : message.sessionid,
        updateName : updateName,
        eventName : message.event && message.event.name,  
        snapshot : message.snapshot,
        event : message.event
    });

    grid.setSelectedRows([0]);


  }, false);
});


var grid,
    data = [],
    columns = [
        { id: "scxmlName", name: "SCXML Name", field: "name", width: 120 },
        //{ id: "docUrl", name: "URL", field: "docUrl", width: 120 },
        { id: "sessionid", name: "Sesssionid", field: "sessionid", width: 120 },
        { id: "updateName", name: "Update", field: "updateName", width: 120 },
        { id: "eventName", name: "Event Name", field: "eventName", width: 120 },
    ],
    options = {
      enableCellNavigation: true,
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

grid.setSelectionModel(new Slick.RowSelectionModel());

dataView.setItems(data);

grid.onSelectedRowsChanged.subscribe(function(){
  console.log(arguments);
  let rows = grid.getSelectedRows();
  let row = dataView.getItem(rows[0]);
  console.log(row);
  //render the docUrl on the selectedRow
  lazyRenderSchviz(row.docUrl,row.snapshot);
})

let schviz;

function lazyRenderSchviz(docUrl,snapshot){
  $.get('/' + docUrl).then(function(scxmlContents){
    let scjson = scxml.ext.compilerInternals.scxmlToScjson(scxmlContents);
    schviz = renderSchviz(scjson,snapshot);
  });
  
}

function renderSchviz(scjson,snapshot){
  var rootElement = 
    React.createElement(
      SCHVIZ.default,
      {
        scjson:scjson, 
        layoutOptions:SCHVIZ.default.layouts.right,
        configuration:snapshot[0],
        disableAnimation:true
      }
    );

  return ReactDOM.render(
    rootElement,
    document.querySelector('#schvizContainer')
  );

}

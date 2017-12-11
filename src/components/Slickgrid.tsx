/// <reference types="slickgrid/slick.rowselectionmodel" />

import * as React from "react";

export interface SlickgridProps {
  data : Array<any>;
  selectedRowIndex? : number;
  onSelectedRowChange: any
}

export class SlickgridComponent extends React.Component<SlickgridProps, {}> {

  private rootElement : HTMLDivElement;
  private columns : any;
  private grid : any;
  private dataView : any;
  private options : any;
  private semaphore : boolean;

  constructor(){
    super();
    this.options = {
      enableCellNavigation: true,
      enableColumnReorder: false,
      forceFitColumns : true,
      autoHeight: true
    };
    this.columns = [
      { id: "scxmlName", name: "SCXML Name", field: "name", width: 120 },
      //{ id: "docUrl", name: "URL", field: "docUrl", width: 120 },
      { id: "sessionid", name: "Sesssionid", field: "sessionid", width: 120 },
      { id: "eventName", name: "Event Name", field: "eventName", width: 120 },
    ];
    this.semaphore = false;
  }

  render(){
    return <div ref={e => this.rootElement  = e}></div>;
  }

  componentWillReceiveProps(nextProps){
    this.dataView.setItems(nextProps.data);
    //this.dataView.insertItem(0, nextProps.data[0]);

    this.semaphore = true;
    if(typeof nextProps.selectedRowIndex !== 'undefined' &&
        nextProps.selectedRowIndex !== this.props.selectedRowIndex){
      this.grid.setSelectedRows([nextProps.selectedRowIndex]);
    }else{
      this.grid.setSelectedRows([0]);
    } 
  }

  shouldComponentUpdate(){
    return false;
  }

  componentDidMount(){
    this.dataView = new Slick.Data.DataView();

    // Make the grid respond to DataView change events.
    this.dataView.onRowCountChanged.subscribe((e, args) => {
      this.grid.updateRowCount();
      this.grid.render();
    });

    this.dataView.onRowsChanged.subscribe((e, args) => {
      this.grid.invalidateRows(args.rows);
      this.grid.render();
    });

    this.grid = new Slick.Grid(this.rootElement, this.dataView, this.columns, this.options);

    this.grid.setSelectionModel(new Slick.RowSelectionModel());

    this.dataView.setItems(this.props.data);

    this.grid.setSelectedRows([this.props.selectedRowIndex || 0]);

    window['jQuery'](window).resize(() => {
      this.grid.resizeCanvas();
    })

    this.grid.onSelectedRowsChanged.subscribe(() => {
      if(this.semaphore){
        return this.semaphore = false;
      }
      let rows = this.grid.getSelectedRows();
      let rowIndex = rows[0];
      let row = this.dataView.getItem(rowIndex);
      this.props.onSelectedRowChange(rowIndex);
    })
  }

}

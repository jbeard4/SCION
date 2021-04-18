/// <reference types="slickgrid/slick.rowselectionmodel" />

import * as React from "react";

export interface SlickgridProps {
  data : Array<any>;
  selectedRowIndex? : number;
  onSelectedRowChange: any;
  columns:any;
  options:any;
}

export class SlickgridComponent extends React.Component<SlickgridProps, {}> {

  private rootElement : HTMLDivElement;
  public grid : any;  // this is a bit ugly
  private dataView : any;
  private semaphore : boolean;

  constructor(){
    super();
    this.semaphore = false;
  }

  render(){
    return <div style={{width:'100%',height:'100%'}} ref={e => this.rootElement  = e}></div>;
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.data !== this.props.data){
      this.dataView.setItems(nextProps.data);
      this.grid.setSelectedRows([0]);
      //this.dataView.insertItem(0, nextProps.data[0]);
    }

    if(typeof nextProps.selectedRowIndex !== 'undefined' &&
        nextProps.selectedRowIndex !== this.props.selectedRowIndex){
      this.semaphore = true;
      this.grid.setSelectedRows([nextProps.selectedRowIndex]);
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

    this.grid = new Slick.Grid(this.rootElement, this.dataView, this.props.columns, this.props.options);

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

    setTimeout(() => this.grid.resizeCanvas())  //wait a tick to give layout time to run

  }

  handleResize(){
    this.grid.resizeCanvas();
  }

}

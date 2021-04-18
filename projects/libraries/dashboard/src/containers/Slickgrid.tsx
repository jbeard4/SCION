import * as React from "react";
import {SlickgridComponent} from '../components/Slickgrid';
import { connect } from 'react-redux';
import {getSmallSteps, getSelectedRowIndex} from '../selectors'

interface SlickgridContainerProps {
  smallSteps : any,
  onSelectedRowChange : any,
  selectedRowIndex : any
}

class SlickgridContainer extends React.PureComponent<SlickgridContainerProps> {

  private slickGridComponent;

  handleResize(){
    this.slickGridComponent.handleResize();
  }

  render(){
    const {
      smallSteps,
      onSelectedRowChange,
      selectedRowIndex
    } = this.props; 

    return <SlickgridComponent
      ref={(e) => this.slickGridComponent = e}
      options={{
        enableCellNavigation: true,
        enableColumnReorder: false,
        forceFitColumns : true
      }}
      columns={[
        { id: "scxmlName", name: "SCXML Name", field: "name", width: 120 },
        { id: "sessionid", name: "Sesssionid", field: "sessionid", width: 120 },
        { id: "eventName", name: "Event Name", field: "eventName", width: 120 },
      ]}
      data={smallSteps}
      onSelectedRowChange={onSelectedRowChange}
      selectedRowIndex={selectedRowIndex}/>;
    }
}


function mapStateToProps(state, ownProps) {
  return {
    smallSteps: getSmallSteps(state),
    selectedRowIndex: getSelectedRowIndex(state),
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    onSelectedRowChange : (rowIndex) => {
      dispatch({
        type : 'SELECT_SMALL_STEP',
        index : rowIndex
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  {withRef: true}
)(SlickgridContainer);

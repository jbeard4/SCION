import * as React from "react";
import SCHVIZ from '@scion-scxml/schviz';
import { connect } from 'react-redux';
import {getCurrentRow, getTransitionsTaken} from '../selectors'

interface SchvizContainerProps {
  currentRow : any, 
  urlToSCXML: any,
  transitionsTaken : any
}

class SchvizContainer extends React.PureComponent<SchvizContainerProps> {

  private schvizComponent;

  handleResize(){
    this.schvizComponent && this.schvizComponent.handleResize();
  }


  render(){
    const {
      currentRow, 
      urlToSCXML,
      transitionsTaken
    } = this.props;

    return currentRow ?
      <SCHVIZ 
        ref={(e) => this.schvizComponent = e}
        expandAllStatesByDefault={true}
        disableAnimation={true}
        urlToSCXML={urlToSCXML} 
        configuration={currentRow.snapshot[0]}
        previousConfiguration={currentRow.previousConfiguration}
        statesForDefaultEntry={currentRow.defaultStatesEntered }
        transitionsEnabled={transitionsTaken}
        hideActions={true}
        id="dashboard" 
        /> : 
      null;
  }
}

function mapStateToProps(state, ownProps) {
  const currentRow = getCurrentRow(state);
  return {
    currentRow: currentRow,
    urlToSCXML: `${ownProps.baseUrl || ''}${currentRow.docUrl}`,
    transitionsTaken: getTransitionsTaken(state)
  };
}

export default connect(
  mapStateToProps,
  undefined,
  undefined,
  {withRef: true}
)(SchvizContainer);

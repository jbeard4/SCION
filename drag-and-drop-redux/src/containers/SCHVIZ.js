import { connect } from 'react-redux'
import SCHVIZ from 'schviz2';
import fnModel from '../../dist/drag-and-drop'

const scjson = fnModel()

const mapStateToProps = ([configuration, history, isInFinalState, datamodel], ownProps) => {
  return {
    configuration : configuration,
    scjson : scjson 
  }
}

let InteractiveSCHVIZ = connect(
  mapStateToProps,
  null
)(SCHVIZ)

export default InteractiveSCHVIZ  


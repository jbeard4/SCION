import { connect } from 'react-redux'
import SCHVIZ from '@jbeard/schviz2';
import fnModel from '../../dist/drag-and-drop'

const scjson = fnModel()

const mapStateToProps = ([configuration, history, isInFinalState, datamodel], ownProps) => {
  return {
    configuration,
    scjson,
    hideActions : true
  }
}

let InteractiveSCHVIZ = connect(
  mapStateToProps,
  null
)(SCHVIZ)

export default InteractiveSCHVIZ  


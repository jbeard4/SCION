import { connect } from 'react-redux'
import SCHVIZ from '@jbeard/schviz2';
import scjson from '../../dist/drag-and-drop.json'

const mapStateToProps = ({ snapshot: [configuration, history, isInFinalState, datamodel] }, ownProps) => {
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


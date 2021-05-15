import { connect } from 'react-redux'
import { mouseevent } from '../actions'
import Rect from '../components/Rect';

const mapStateToProps = ({ snapshot: [configuration, history, isInFinalState, datamodel] }, ownProps) => {
  return {
    x : datamodel.rectX,
    y : datamodel.rectY
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMouseDown: (e) => {
    dispatch(mouseevent(e))
  },
  onMouseUp: (e) => {
    dispatch(mouseevent(e))
  },
  onMouseMove: (e) => {
    dispatch(mouseevent(e))
  }
})

let DraggableRect = connect(
  mapStateToProps,
  mapDispatchToProps
)(Rect)

export default DraggableRect 

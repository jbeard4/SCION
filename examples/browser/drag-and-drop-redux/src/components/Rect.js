import React from 'react'
import PropTypes from 'prop-types'


const Rect = ({ x, y, onMouseDown, onMouseUp, onMouseMove }) => {
  return (
    <rect x={x} y={y} 
      onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseMove={onMouseMove}
      width="100" height="100"/>
  )
}

Rect.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  onMouseDown:PropTypes.func.isRequired,
  onMouseUp:PropTypes.func.isRequired,
  onMouseMove:PropTypes.func.isRequired
}

export default Rect


import React from 'react'

export const ShowHideSourceCodeLink = ({self}) => (
  <p style={{textAlign:'right', color: 'blue', cursor: 'pointer'}} onClick={ () => self.setState({showSourceCode : !self.state.showSourceCode}) }>
    <em>{
      self.state.showSourceCode ? 
        'Click to hide source code.' :
        'Click to show source code.' 
    }</em>
  </p>
)

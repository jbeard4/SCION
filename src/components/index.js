import React from 'react'

export const ShowHideSourceCodeLink = ({self}) => (
  <p style={{textAlign:'right', color: 'blue', cursor: 'pointer', fontStyle: 'italic'}} onClick={ () => self.setState({showSourceCode : !self.state.showSourceCode}) }>
    {
      self.state.showSourceCode ? 
        <span>Click to show application <i className="fab fa-react"></i></span> :
        <span>Click to show source code <i className="fas fa-file-code"></i></span>
    }
  </p>
)

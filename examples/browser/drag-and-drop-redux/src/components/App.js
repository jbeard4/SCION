import React from 'react'
import DraggableRect from '../containers/DnD'
import InteractiveSCHVIZ from '../containers/SCHVIZ'

const App = () => (
  <div style={{width:'100%', height:'100%'}}>
    <div style={{width:'100%', height:'100%'}}>
      <svg width="100%" height="100%">
        <DraggableRect/>
      </svg>
    </div>
    <div id="viz">
      <InteractiveSCHVIZ />
    </div>
  </div>
)

export default App

import React from 'react'

export default class DragAndDropDemo extends React.Component {

  constructor(props){
    super(props);
    this.handleMouseEvent = this.handleMouseEvent.bind(this);
  }

  handleMouseEvent(e){
    e.persist();
    this.props.scPromise.then( (sc) => sc.gen(e.type, e) )
  }

  render() {
    return <div 
        style={{width: '100%', height: '100%'}}
        onMouseMove={ this.handleMouseEvent }
      >
      <div 
        onMouseDown={ this.handleMouseEvent }
        onMouseUp={ this.handleMouseEvent }
        style={{
          width:'100px',
          height:'100px',
          backgroundColor:'red',
          border:'2px solid black',
          position:'absolute',
          left: `${this.props.datamodel && this.props.datamodel.rectX}px`,
          top: `${this.props.datamodel && this.props.datamodel.rectY}px`
        }}>
          {this.props.configuration && this.props.configuration[0]}
        </div>
    </div>
  }
}

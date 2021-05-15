import React from 'react'
import './drag-and-drop-example.css';

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
        className="drag-and-drop-example"
        onMouseMove={ this.handleMouseEvent }
      >
      <div 
        className="rect"
        onMouseDown={ this.handleMouseEvent }
        onMouseUp={ this.handleMouseEvent }
        style={{
          left: `${this.props.datamodel && this.props.datamodel.rectX}px`,
          top: `${this.props.datamodel && this.props.datamodel.rectY}px`
        }}>
          {this.props.configuration && this.props.configuration[0]}
        </div>
    </div>
  }
}

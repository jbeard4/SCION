import * as React from "react";

interface RunButtonProps {
  running : boolean;
  handleClick : React.EventHandler<React.MouseEvent>;
}

interface RunButtonState {
}

export default class RunButton extends React.Component<RunButtonProps, RunButtonState> {
  constructor(props){
    super(props);
  }

  render(){
    return <div style={{position:'absolute', bottom:'2em', right:'1em', opacity: 1 }}>
      <button  
        onClick={this.props.handleClick} 
        style={{borderRadius : '1.25em', fontSize : '2em', outline: 'none', padding : '.5em'}}>
          <span className={`fa ${this.props.running ? 'fa-stop' : 'fa-play'}`}></span>
      </button>
    </div>;
  }
}

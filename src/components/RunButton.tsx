import * as React from "react";

interface RunButtonProps {
  running : boolean;
}

interface RunButtonState {
  running : boolean;
}

export default class RunButton extends React.Component<RunButtonProps, RunButtonState> {
  constructor(props){
    super(props);
    this.state = {running : true};
  }

  handleClick(){
    this.setState({running : !this.state.running})
  }

  render(){
    return <div style={{position:'absolute', bottom:'2em', right:'1em', opacity: 1 }}>
      <button  onClick={this.handleClick.bind(this)} style={{borderRadius : '1.25em', fontSize : '2em', outline: 'none', padding : '.5em'}}><span className={`fa ${this.state.running ? 'fa-stop' : 'fa-play'}`}></span></button>
    </div>;
  }
}

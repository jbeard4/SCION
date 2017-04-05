import * as React from "react";

interface RunButtonProps {
  running : boolean;
  handleClick : any;
}

interface RunButtonState {
}

export default class RunButton extends React.Component<RunButtonProps, RunButtonState> {
  constructor(props){
    super(props);
  }

  render(){
    return <div className="runButton">
      <button onClick={this.props.handleClick}>
          <span className={`fa ${this.props.running ? 'fa-stop' : 'fa-play'}`}></span>
      </button>
    </div>;
  }
}

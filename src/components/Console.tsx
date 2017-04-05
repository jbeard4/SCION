import * as React from "react";

interface ConsoleComponentProps{
  handleSubmit : any;
} 

interface ConsoleComponentState{
}

export default class ConsoleComponent extends React.Component<ConsoleComponentProps, ConsoleComponentState> {

  eventInputElement : HTMLInputElement;

  constructor(props){
    super(props);
  }

  handleSubmit(event){
    console.log('handle submit', event);
    event.preventDefault();
    let scxmlEventString = this.eventInputElement.value;
    let eventObj = this.parseEventString(scxmlEventString);
    this.eventInputElement.value = '';  //clear him

    this.props.handleSubmit(eventObj);
  }

  private parseEventString(str){
    try {
      var o = JSON.parse(str);
      return o;
    } catch(e) {
      //assume str is the event name
      return {name : str};
    }
  }

  render(){
    return <form id="console" onSubmit={this.handleSubmit.bind(this)}>
      <input ref={ (e) => this.eventInputElement = e } type="text" id="event-input"></input>
      <input type="submit" id="event-button" value="Send Event"></input>
    </form>;
  }
  
}

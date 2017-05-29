import * as React from "react";

export interface ConsoleProps{
  handleSubmit : any;
  isActive : boolean;
} 

export interface ConsoleState{
} 

export default class Console extends React.Component<ConsoleProps, ConsoleState> {

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

  componentDidUpdate(){
    this.eventInputElement.focus();
  }

  render(){
    let styles = 
      {
        display:'flex',
        overflow:'hidden' as 'hidden',
        maxHeight: this.props.isActive ? '2em' : '0em',
        transition: 'max-height 0.5s ease-out',
        margin : 0
      }

    return <form style={styles} onSubmit={this.handleSubmit.bind(this)}>
  
      <input style={{flexGrow:1}} ref={ (e) => this.eventInputElement = e } type="text" id="event-input"></input>
      <input type="submit" id="event-button" value="Send Event"></input>
    </form>;
  }
  
}


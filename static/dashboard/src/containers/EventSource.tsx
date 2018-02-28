/// <reference types="slickgrid/slick.rowselectionmodel" />

import * as React from "react";
import { connect } from 'react-redux';

// definitions from https://github.com/Microsoft/TypeScript/pull/14658/files 

interface EventSourceMap {
    "error": Event;
    "message": MessageEvent;
    "open": Event;
}

interface EventSourceConfig {
    withCredentials?: boolean;
}

interface EventSource extends EventTarget {
    readonly readyState: number;
    readonly url: string;
    readonly withCredentials: boolean;
    readonly CONNECTING: number;
    readonly OPEN: number;
    readonly CLOSED: number;
    onopen: (this: EventSource, ev: Event) => any;
    onmessage: (this: EventSource, ev: MessageEvent) => any;
    onerror: (this: EventSource, ev: Event) => any;
    close: () => void;
    addEventListener<K extends keyof EventSourceMap>(type: K, listener: (this: WebSocket, ev: EventSourceMap[K]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
}

declare var EventSource: {
    prototype: EventSource;
    new (url: string, configuration?: EventSourceConfig): EventSource;
    readonly CONNECTING: number;
    readonly OPEN: number;
    readonly CLOSED: number;
}


export interface EventSourceProps {
  onSmallStep : any;
}

export interface EventSourceState {
  readyState : number;
}

const EVENTSOURCE_TIMEOUT = 1000;

export class EventSourceComponent extends React.Component<EventSourceProps, EventSourceState> {

  private source : EventSource;

  constructor(){
    super();
    this.initEventSource();
  }

  initEventSource(){

    //TODO: break this out into an action creator
    //TODO: parameterize this so that we can receive events from an EventEmitter
    this.source = new EventSource('/api/update-stream');

    this.source.addEventListener('onSmallStepEnd', (e:any) => {
      this.setState({readyState : this.source.readyState});
      let message = JSON.parse(e.data);
      this.props.onSmallStep(e.lastEventId, message);
      console.log('onSmallStepEnd', e);
    }, false);

    this.source.onopen = (e) => {
      this.setState({readyState : this.source.readyState});
    };

    this.source.onerror = (err) => {
      this.source.close();
      this.setState({readyState : this.source.readyState});
      setTimeout(() => {
        this.initEventSource();    //restart the event source
      }, EVENTSOURCE_TIMEOUT);
    };

    this.state = {readyState : this.source.readyState};
  }

  render(){
    return <div> 
      {
        (() => {
          switch(this.state.readyState){
            case EventSource.OPEN:
              return <span style={{color : "green"}}><i className="fa fa-check" aria-hidden="true"></i> Connected to debug server </span> 
            case EventSource.CLOSED:
            case EventSource.CONNECTING:
              return <span style={{color : "red"}}><i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Connection Error: Reconnecting</span>
          } 
        })()
      }
    </div>
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    onSmallStep : (lastEventId, message) => {
      dispatch({
        type : 'SMALL_STEP',
        message, 
        lastEventId
      })
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventSourceComponent);

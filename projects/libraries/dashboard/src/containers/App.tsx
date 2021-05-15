import * as React from "react";
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import events = require('events');
import SidePanelContainer from '../containers/SidePanel';
import SlickgridContainer from '../containers/Slickgrid';
import SCHVIZContainer from '../containers/SCHVIZ';

export interface AppProps {
  inputEventEmitter? : events.EventEmitter;
  baseUrl? : string;
};

class App extends React.Component<AppProps, {}> {

  private rootElement : HTMLDivElement;
  private slickgridComponent : any;
  private schvizComponent : any;
  private lastEventId;
  private smallStepHandler: any;
  private myLayout : any;

  render() {
    return (
      <div  style={{width:'100%',height:'100%'}} 
            ref={(e: HTMLDivElement) => { this.rootElement = e; }}>
        <div className="ui-layout-center">
          <SCHVIZContainer />
        </div>
        <div className="ui-layout-south">
          <SlickgridContainer />
        </div>
        <div className="ui-layout-east">
          <SidePanelContainer inputEventEmitter={this.props.inputEventEmitter} />
        </div>
      </div>
    );
  }

  componentDidMount(){
    this.myLayout = (window['jQuery'](this.rootElement) as any).layout({ 
      applyDefaultStyles: true, 
      south__onresize: (() => { 
        //this.slickgridComponent && this.slickgridComponent.grid.resizeCanvas()
      }),
      center__onresize:	(() => { 
        setTimeout( () => {
          //this.schvizComponent && this.schvizComponent.graphRoot.refreshViewbox();
        })
      }),
      stateManagement__enabled:	true,
      south__minSize: 100
    });
  }

}

export default App;

import * as React from "react";
import Collapsible from '@scion-scxml/react-collapsible';
import EventSourceContainer from '../containers/EventSource';
import {TableInspector, ObjectInspector} from 'react-inspector';
import {DiffComponent} from '../components/Diff';

const SidePanel = ({
  currentRow, 
  sessionTable, 
  currentRowDatamodel,
  previousSessionDatamodel,
  collapsible,
  inputEventEmitter,
  onTriggerClick
}) => (
  <div style={{width:'100%', height:'100%', overflow:'auto'}}>
    {
      !inputEventEmitter && <EventSourceContainer />
    }
    <Collapsible 
      trigger="Session Hierarchy"
      open={collapsible['sessionHierarchy']}
      handleTriggerClick={onTriggerClick.bind(this,'sessionHierarchy')}
      >
      {
        currentRow ? 
          <TableInspector 
            columns={['name', 'sessionid']}
            data={sessionTable}/> : 
          null
      }
    </Collapsible>
    <Collapsible 
      trigger="Input Event"
      open={collapsible['inputEvent']}
      handleTriggerClick={onTriggerClick.bind(this,'inputEvent')}
      >
      {
        currentRow ? 
          <ObjectInspector data={currentRow.event}/> : 
          null
      }
    </Collapsible>
    <Collapsible 
      trigger="Datamodel" 
      open={collapsible['datamodel']}
      handleTriggerClick={onTriggerClick.bind(this,'datamodel')}
      >
      {
        currentRow ? 
          <ObjectInspector data={currentRowDatamodel}/> : 
          null
      }
    </Collapsible>
    <Collapsible 
      trigger="Datamodel Diff"
      open={collapsible['datamodelDiff']}
      handleTriggerClick={onTriggerClick.bind(this,'datamodelDiff')}
      >
      <DiffComponent left={currentRowDatamodel} right={previousSessionDatamodel}/>
    </Collapsible>
    <Collapsible 
      trigger="Inner Queue" 
      open={collapsible['innerQueue']}
      handleTriggerClick={onTriggerClick.bind(this,'innerQueue')}
      >
      {
        currentRow ? 
          <TableInspector data={currentRow.snapshot[4]}/> : 
          null
      }
    </Collapsible>
  </div>
);

export default SidePanel;

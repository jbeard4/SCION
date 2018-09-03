import * as React from "react";
import {DiffPatcher, formatters}  from '@scion-scxml/jsondiffpatch'; 

export interface DiffProps {
  left : any;
  right : any;
}

export class DiffComponent extends React.Component<DiffProps, {}> {

  private rootElement : HTMLDivElement;

  render(){
    const diffPatcher = new DiffPatcher();
    const delta = diffPatcher.diff(this.props.left, this.props.right);

    return <div 
      dangerouslySetInnerHTML={{ __html: formatters.html.format(delta, this.props.left) }}
      style={{width:'100%',height:'100%'}} 
      ref={e => this.rootElement  = e}
      >
    </div>;
  }

}

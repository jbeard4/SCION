import React from 'react'
import SCHVIZ from '@scion-scxml/schviz'
import { SCComponent } from '../common'
import MicrowavePanel from '../w3c-microwave-example/microwave-panel'
import microwaveParallelScxml from './w3c-microwave-parallel.scxml'

export { microwaveParallelScxml }

export default class W3CMicrowaveParallelExample extends SCComponent {
  constructor(props) {
    super(props, microwaveParallelScxml)
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '560px' }}>
        <div className="col-md-6" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '560px', width: '100%', position: 'relative', border: '1px solid #eee' }}>
            <SCHVIZ
              scxmlDocumentString={microwaveParallelScxml}
              disableAnimation={true}
              disableZoom={true}
              configuration={this.state && this.state.configuration}
              disableZoomAnimation={true}
              transitionsEnabled={this.state && this.state.transitionsEnabled}
              expandAllStatesByDefault={true}
              layoutOptions={SCHVIZ.layouts.auto}
              id="w3c-microwave-parallel"
            />
          </div>
        </div>
        <div className="col-md-6" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '560px', border: '1px solid #eee' }}>
            <MicrowavePanel
              sc={this.sc}
              configuration={this.state && this.state.configuration}
              datamodel={this.state && this.state.datamodel}
            />
          </div>
        </div>
      </div>
    )
  }
}

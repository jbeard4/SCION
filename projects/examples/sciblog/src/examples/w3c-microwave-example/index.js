import React from 'react'
import SCHVIZ from '@scion-scxml/schviz'
import { SCComponent } from '../common'
import MicrowavePanel from './microwave-panel'
import microwaveScxml from './w3c-microwave.scxml'

export { microwaveScxml }

export default class W3CMicrowaveExample extends SCComponent {
  constructor(props) {
    super(props, microwaveScxml)
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '520px' }}>
        <div className="col-md-6" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '520px', width: '100%', position: 'relative', border: '1px solid #eee' }}>
            <SCHVIZ
              scxmlDocumentString={microwaveScxml}
              disableAnimation={true}
              configuration={this.state && this.state.configuration}
              disableZoomAnimation={true}
              transitionsEnabled={this.state && this.state.transitionsEnabled}
              expandAllStatesByDefault={true}
              layoutOptions={SCHVIZ.layouts.auto}
              id="w3c-microwave"
            />
          </div>
        </div>
        <div className="col-md-6" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '520px', border: '1px solid #eee' }}>
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

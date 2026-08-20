import React from 'react'
import SCHVIZ from '@scion-scxml/schviz'
import { SCComponent } from '../common'
import CalculatorPanel from './calculator-panel'
import calculatorScxml from './calculator.scxml'

export { calculatorScxml }

export default class W3CCalculatorExample extends SCComponent {
  constructor(props) {
    super(props, calculatorScxml)
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '1180px' }}>
        <div className="col-md-10" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '1180px', width: '100%', overflow: 'auto', border: '1px solid #eee' }}>
            <div style={{ height: '1600px', width: '1320px', position: 'relative' }}>
              <SCHVIZ
                scxmlDocumentString={calculatorScxml}
                disableAnimation={true}
                configuration={this.state && this.state.configuration}
                disableZoomAnimation={true}
                transitionsEnabled={this.state && this.state.transitionsEnabled}
                expandAllStatesByDefault={true}
                layoutOptions={SCHVIZ.layouts.auto}
                id="w3c-calculator"
              />
            </div>
          </div>
        </div>
        <div className="col-md-2" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '1180px', border: '1px solid #eee' }}>
            <CalculatorPanel sc={this.sc} datamodel={this.state && this.state.datamodel} />
          </div>
        </div>
      </div>
    )
  }
}

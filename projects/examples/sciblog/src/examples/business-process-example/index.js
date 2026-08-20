import React from 'react'
import scxml from '@scion-scxml/scxml'
import SCHVIZ from '@scion-scxml/schviz'
import BusinessProcessPanel from './business-process-panel'
import businessProcessScxml from './order-fulfillment.scxml'

export { businessProcessScxml }

export default class BusinessProcessExample extends React.Component {
  constructor(props) {
    super(props)
    this.state = { log: [] }
  }

  componentDidMount() {
    this.start()
  }

  start() {
    this.setState({ log: [] })

    scxml.documentStringToModel(null, businessProcessScxml, (err, model) => {
      if (err) throw err
      model.prepare((err, modelFactory) => {
        if (err) throw err

        this.sc = new scxml.scion.Statechart(modelFactory, {
          customSend: this.customSend.bind(this),
        })

        let transitionsEnabled
        this.sc.on('onBigStepBegin', () => {
          transitionsEnabled = new Map()
        })
        this.sc.on('onBigStepEnd', () => {
          const [_, history, isInFinalState, datamodel] = this.sc.getSnapshot()
          this.setState({
            datamodel,
            configuration: this.sc.getFullConfiguration(),
            transitionsEnabled,
          })
        })
        this.sc.on('onTransition', (transitionSourceId, targetIds, transitionIndex) => {
          if (transitionsEnabled.has(transitionSourceId)) {
            transitionsEnabled.get(transitionSourceId).add(transitionIndex)
          } else {
            transitionsEnabled.set(transitionSourceId, new Set([transitionIndex]))
          }
        })
        this.sc.start()
      })
    })
  }

  customSend(event) {
    if (event.name === 'trace') {
      this.appendLog(event.data)
    } else {
      this.sc.gen(event)
    }
  }

  appendLog(entry) {
    if (!entry) return
    this.setState(({ log }) => ({ log: log.concat(entry).slice(-12) }))
  }

  send(event) {
    if (this.sc) this.sc.gen(event)
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '640px' }}>
        <div className="col-md-8" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '640px', width: '100%', position: 'relative', border: '1px solid #eee' }}>
            <SCHVIZ
              scxmlDocumentString={businessProcessScxml}
              disableAnimation={true}
              disableZoom={true}
              configuration={this.state && this.state.configuration}
              disableZoomAnimation={true}
              transitionsEnabled={this.state && this.state.transitionsEnabled}
              expandAllStatesByDefault={true}
              layoutOptions={SCHVIZ.layouts.auto}
              id="business-process"
            />
          </div>
        </div>
        <div className="col-md-4" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '640px', border: '1px solid #eee' }}>
            <BusinessProcessPanel
              configuration={this.state.configuration}
              datamodel={this.state.datamodel}
              log={this.state.log}
              onEvent={event => this.send(event)}
              onReset={() => this.start()}
            />
          </div>
        </div>
      </div>
    )
  }
}

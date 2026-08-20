import React from 'react'
import scxml from '@scion-scxml/scxml'
import SCHVIZ from '@scion-scxml/schviz'
import LanguageOverviewPanel from './language-overview-panel'
import languageOverviewScxml from './language-overview.scxml'

export { languageOverviewScxml }

export default class W3CLanguageOverviewExample extends React.Component {
  constructor(props) {
    super(props)
    this.timeouts = {}
    this.state = {
      log: [],
    }
  }

  componentDidMount() {
    this.start()
  }

  componentWillUnmount() {
    this.cancelAll()
  }

  start() {
    this.cancelAll()
    this.setState({ log: [] })

    scxml.documentStringToModel(null, languageOverviewScxml, (err, model) => {
      if (err) throw err
      model.prepare((err, modelFactory) => {
        if (err) throw err

        this.sc = new scxml.scion.Statechart(modelFactory, {
          customSend: this.customSend.bind(this),
          customCancel: this.customCancel.bind(this),
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

  customSend(event, options) {
    const send = () => {
      if (event.name === 'trace') {
        this.appendLog(event.data)
      } else if (event.name.indexOf('external.') === 0) {
        this.appendLog(`${event.name}${event.data ? ` ${JSON.stringify(event.data)}` : ''}`)
      } else {
        this.sc.gen(event)
      }
    }

    if (options && options.delay) {
      this.timeouts[event.sendid] = setTimeout(send, options.delay)
    } else {
      send()
    }
  }

  customCancel(sendid) {
    clearTimeout(this.timeouts[sendid])
    delete this.timeouts[sendid]
  }

  cancelAll() {
    Object.keys(this.timeouts).forEach(sendid => this.customCancel(sendid))
  }

  appendLog(entry) {
    if (!entry) return
    this.setState(({ log }) => ({ log: log.concat(entry).slice(-12) }))
  }

  send(event) {
    if (this.sc) this.sc.gen(event)
  }

  reset() {
    this.start()
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '620px' }}>
        <div className="col-md-8" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '620px', width: '100%', position: 'relative', border: '1px solid #eee' }}>
            <SCHVIZ
              scxmlDocumentString={languageOverviewScxml}
              disableAnimation={true}
              configuration={this.state && this.state.configuration}
              disableZoomAnimation={true}
              transitionsEnabled={this.state && this.state.transitionsEnabled}
              expandAllStatesByDefault={true}
              layoutOptions={SCHVIZ.layouts.auto}
              id="w3c-language-overview"
            />
          </div>
        </div>
        <div className="col-md-4" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '620px', border: '1px solid #eee' }}>
            <LanguageOverviewPanel
              configuration={this.state.configuration}
              log={this.state.log}
              onEvent={event => this.send(event)}
              onReset={() => this.reset()}
            />
          </div>
        </div>
      </div>
    )
  }
}

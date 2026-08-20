import React from 'react'
import scxml from '@scion-scxml/scxml'
import SCHVIZ from '@scion-scxml/schviz'
import MorsePanel from './morse-panel'
import morseScxml from './morse.scxml'

export { morseScxml }

export default class MorseExample extends React.Component {
  constructor(props) {
    super(props)
    this.timeouts = {}
    this.state = {
      transcript: '',
      signals: [],
    }
  }

  componentDidMount() {
    scxml.documentStringToModel(null, morseScxml, (err, model) => {
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

  componentWillUnmount() {
    Object.keys(this.timeouts).forEach(sendid => this.customCancel(sendid))
  }

  customSend(event, options) {
    const send = () => {
      switch (event.name) {
        case 'dot':
          this.appendSignal('.')
          break
        case 'dash':
          this.appendSignal('-')
          break
        case 'short_pause':
          this.appendSignal('/')
          break
        case 'out.symbol':
          this.appendSymbol(event.data)
          break
        default:
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

  appendSignal(signal) {
    this.setState(({ signals }) => ({ signals: signals.concat(signal).slice(-24) }))
  }

  appendSymbol(symbol) {
    if (!symbol) return
    this.setState(({ transcript }) => ({
      transcript: transcript + symbol,
      signals: [],
    }))
  }

  pulse(duration) {
    if (!this.sc) return
    this.sc.gen('device.press')
    setTimeout(() => this.sc && this.sc.gen('device.release'), duration)
  }

  restart() {
    if (this.sc) this.sc.gen('input.restart')
    Object.keys(this.timeouts).forEach(sendid => this.customCancel(sendid))
    this.setState({ transcript: '', signals: [] })
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '560px' }}>
        <div className="col-md-8" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '560px', width: '100%', position: 'relative', border: '1px solid #eee' }}>
            <SCHVIZ
              scxmlDocumentString={morseScxml}
              disableAnimation={true}
              configuration={this.state && this.state.configuration}
              disableZoomAnimation={true}
              transitionsEnabled={this.state && this.state.transitionsEnabled}
              expandAllStatesByDefault={true}
              layoutOptions={SCHVIZ.layouts.auto}
              id="morse-example"
            />
          </div>
        </div>
        <div className="col-md-4" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '560px', border: '1px solid #eee' }}>
            <MorsePanel
              configuration={this.state.configuration}
              datamodel={this.state.datamodel}
              transcript={this.state.transcript}
              signals={this.state.signals}
              onPress={() => this.sc && this.sc.gen('device.press')}
              onRelease={() => this.sc && this.sc.gen('device.release')}
              onPulse={duration => this.pulse(duration)}
              onRestart={() => this.restart()}
            />
          </div>
        </div>
      </div>
    )
  }
}

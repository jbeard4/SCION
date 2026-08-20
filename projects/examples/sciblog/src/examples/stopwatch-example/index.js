import React from 'react'
import scxml from '@scion-scxml/scxml'
import SCHVIZ from '@scion-scxml/schviz'
import StopWatchPanel from './stopwatch-panel'
import stopwatchScxml from './stopwatch.scxml'

export { stopwatchScxml }

const initialDisplay = {
  ElapsedMS: '00:00',
  LapMS: '00:00',
  LapCount: 0,
}

export default class StopWatchExample extends React.Component {
  constructor(props) {
    super(props)
    this.timeouts = {}
    this.state = {
      display: initialDisplay,
      laps: [],
    }
  }

  componentDidMount() {
    scxml.documentStringToModel(null, stopwatchScxml, (err, model) => {
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
          const configuration = this.sc.getFullConfiguration()
          this.setState({ configuration, transitionsEnabled })
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
      if (event.name === 'out.display') {
        this.updateDisplay(event.data || initialDisplay)
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

  updateDisplay(display) {
    this.setState(({ laps }) => {
      const lapCount = display.LapCount || 0
      if (lapCount === 0) {
        return { display, laps: [] }
      }

      const nextLaps = laps.slice()
      if (nextLaps.length !== lapCount + 1) {
        if (lapCount === 1 && nextLaps.length === 0) {
          nextLaps.unshift({
            lapIndex: 1,
            startTime: '00:00.000',
            endTime: display.ElapsedMS,
          })
        }
        nextLaps.unshift({
          lapIndex: lapCount + 1,
          startTime: display.ElapsedMS,
          endTime: '00:00.000',
        })
      } else if (nextLaps.length > 1) {
        nextLaps[0] = Object.assign({}, nextLaps[0], { endTime: display.LapMS })
      }

      return { display, laps: nextLaps }
    })
  }

  render() {
    return (
      <div className="row" style={{ minHeight: '520px' }}>
        <div className="col-md-8" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '520px', width: '100%', position: 'relative', border: '1px solid #eee' }}>
            <SCHVIZ
              scxmlDocumentString={stopwatchScxml}
              disableAnimation={true}
              configuration={this.state && this.state.configuration}
              disableZoomAnimation={true}
              transitionsEnabled={this.state && this.state.transitionsEnabled}
              expandAllStatesByDefault={true}
              layoutOptions={SCHVIZ.layouts.auto}
              id="stopwatch-example"
            />
          </div>
        </div>
        <div className="col-md-4" style={{ marginBottom: '1rem' }}>
          <div style={{ height: '520px', border: '1px solid #eee' }}>
            <StopWatchPanel
              configuration={this.state.configuration}
              display={this.state.display}
              laps={this.state.laps}
              onButton1={() => this.sc && this.sc.gen('button.1')}
              onButton2={() => this.sc && this.sc.gen('button.2')}
            />
          </div>
        </div>
      </div>
    )
  }
}

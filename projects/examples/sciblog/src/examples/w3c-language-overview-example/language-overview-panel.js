import React from 'react'

const steps = [
  {
    state: 'Test1Sub1',
    title: 'Basic transition',
    description: 'Dispatch Event1 to leave the first atomic substate and complete Test1.',
    event: 'Event1',
    label: 'Send Event1',
  },
  {
    state: 'Test2Sub1',
    title: 'Included substate',
    description: 'Dispatch Event2 to complete the inlined external substate example.',
    event: 'Event2',
    label: 'Send Event2',
  },
  {
    state: 'Test3Sub1',
    title: 'Delayed send',
    description: 'A Timer event is scheduled for five seconds after entering this state.',
    event: 'Timer',
    label: 'Fire Timer now',
  },
  {
    state: 'Dialing',
    title: 'External event',
    description: 'The chart sent a create-call request. Confirm that the connection is established.',
    event: 'external.connected',
    label: 'Connected',
  },
  {
    state: 'Prompting',
    title: 'Prompt callback',
    description: 'The prompt step is waiting for an external completion event.',
    event: 'external.prompt.done',
    label: 'Prompt done',
  },
  {
    state: 'StartingSecondForm',
    title: 'Second form',
    description: 'The chart requested a second form. Complete that external interaction.',
    event: 'external.second.done',
    label: 'Second form done',
  },
  {
    state: 'Disconnecting',
    title: 'Disconnect',
    description: 'The chart requested a disconnect. Confirm the final external event.',
    event: 'external.disconnected',
    label: 'Disconnected',
  },
]

const LanguageOverviewPanel = ({ configuration, log, onEvent, onReset }) => {
  const states = configuration || []
  const activeStep = steps.find(step => states.indexOf(step.state) > -1)
  const isDone = states.indexOf('Done') > -1

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
          Active flow
        </div>
        <h3 style={{ margin: '0.25rem 0' }}>
          {isDone ? 'Done' : activeStep ? activeStep.title : 'Advancing'}
        </h3>
        <p style={{ minHeight: '3rem', marginBottom: 0 }}>
          {isDone ? 'The wrapper state reached its final child state.' : activeStep && activeStep.description}
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {activeStep &&
          <button className="btn btn-primary" style={{ marginRight: '0.5rem' }} onClick={() => onEvent(activeStep.event)}>
            {activeStep.label}
          </button>}
        <button className="btn btn-light" onClick={onReset}>
          Reset
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Configuration</strong>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {states.map(state => (
            <span
              key={state}
              style={{
                background: '#fff',
                border: '1px solid #ddd',
                borderRadius: '2px',
                padding: '0.25rem 0.45rem',
                margin: '0 0.35rem 0.35rem 0',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
              }}
            >
              {state}
            </span>
          ))}
        </div>
      </div>

      <div>
        <strong>Trace</strong>
        <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          {(log || []).map((entry, index) => (
            <div key={`${entry}-${index}`} style={{ padding: '0.35rem 0', borderTop: index ? '1px solid #e2e2e2' : 0 }}>
              {entry}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LanguageOverviewPanel

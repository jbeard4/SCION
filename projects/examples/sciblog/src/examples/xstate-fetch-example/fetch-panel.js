import React from 'react'

const status = states => {
  if (states.indexOf('loading') > -1) return { label: 'loading', color: '#c9821f' }
  if (states.indexOf('success') > -1) return { label: 'success', color: '#1f7a4d' }
  if (states.indexOf('failure') > -1) return { label: 'failure', color: '#b8352f' }
  return { label: 'idle', color: '#4c5964' }
}

const FetchPanel = ({ configuration, datamodel, log, onEvent }) => {
  const states = configuration || []
  const current = status(states)
  const attempts = datamodel && typeof datamodel.attempts !== 'undefined' ? datamodel.attempts : 0
  const message = datamodel && datamodel.message ? datamodel.message : 'Loading...'

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ background: current.color, color: '#fff', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Fetch state</div>
        <div style={{ fontSize: '2rem', lineHeight: '2.4rem' }}>{current.label}</div>
        <div>{message}</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '0.75rem', marginBottom: '1rem' }}>
        <strong>Attempts</strong>
        <div>{attempts}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-primary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('FETCH')}>
          Fetch
        </button>
        <button className="btn btn-success" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('RESOLVE')}>
          Resolve
        </button>
        <button className="btn btn-danger" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('REJECT')}>
          Reject
        </button>
        <button className="btn btn-secondary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('RETRY')}>
          Retry
        </button>
        <button className="btn btn-light" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('CANCEL')}>
          Cancel
        </button>
        <button className="btn btn-light" style={{ marginBottom: '0.5rem' }} onClick={() => onEvent('RESET')}>
          Reset
        </button>
      </div>

      <strong>Trace</strong>
      <div style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
        {(log || []).map((entry, index) => (
          <div key={`${entry}-${index}`} style={{ padding: '0.3rem 0', borderTop: index ? '1px solid #e2e2e2' : 0 }}>
            {entry}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FetchPanel

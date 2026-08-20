import React from 'react'

const TogglePanel = ({ configuration, datamodel, log, onEvent }) => {
  const states = configuration || []
  const isActive = states.indexOf('active') > -1
  const toggleCount = datamodel && typeof datamodel.toggleCount !== 'undefined' ? datamodel.toggleCount : 0

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ background: isActive ? '#1f7a4d' : '#4c5964', color: '#fff', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Toggle state</div>
        <div style={{ fontSize: '2rem', lineHeight: '2.4rem' }}>{isActive ? 'active' : 'inactive'}</div>
        <div>{isActive ? 'The modeled switch is enabled.' : 'The modeled switch is disabled.'}</div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '0.75rem', marginBottom: '1rem' }}>
        <strong>Toggle count</strong>
        <div>{toggleCount}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-primary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('TOGGLE')}>
          Toggle
        </button>
        <button className="btn btn-success" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('SET_ACTIVE')}>
          Set active
        </button>
        <button className="btn btn-secondary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('SET_INACTIVE')}>
          Set inactive
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

export default TogglePanel

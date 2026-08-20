import React from 'react'

const statusFor = configuration => {
  const states = configuration || []
  if (states.indexOf('open') > -1) return { label: 'open', color: '#b8352f', detail: 'Fail fast while the dependency recovers.' }
  if (states.indexOf('halfOpen') > -1) return { label: 'half-open', color: '#c9821f', detail: 'Allow one probe request.' }
  return { label: 'closed', color: '#1f7a4d', detail: 'Requests flow normally.' }
}

const CircuitBreakerPanel = ({ configuration, datamodel, log, onEvent, onReset }) => {
  const status = statusFor(configuration)
  const failureCount = datamodel && typeof datamodel.failureCount !== 'undefined' ? datamodel.failureCount : 0
  const failureThreshold = datamodel && datamodel.failureThreshold ? datamodel.failureThreshold : 3
  const lastResult = datamodel && datamodel.lastResult ? datamodel.lastResult : 'none'

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ background: status.color, color: '#fff', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>Circuit state</div>
        <div style={{ fontSize: '2rem', lineHeight: '2.4rem' }}>{status.label}</div>
        <div>{status.detail}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '0.75rem' }}>
          <strong>Failures</strong>
          <div>{failureCount} / {failureThreshold}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #ddd', padding: '0.75rem' }}>
          <strong>Last result</strong>
          <div>{lastResult}</div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-success" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('call.success')}>
          Successful call
        </button>
        <button className="btn btn-danger" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('call.failure')}>
          Failed call
        </button>
        <button className="btn btn-secondary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('cooldown.elapsed')}>
          Cooldown elapsed
        </button>
        <button className="btn btn-light" style={{ marginBottom: '0.5rem' }} onClick={onReset}>
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

export default CircuitBreakerPanel

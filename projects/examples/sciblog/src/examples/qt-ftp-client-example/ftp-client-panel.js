import React from 'react'

const stateLabel = states => {
  if (states.indexOf('B') > -1) return 'B - sending command'
  if (states.indexOf('W') > -1) return 'W - waiting for reply'
  if (states.indexOf('P') > -1) return 'P - supplying password'
  if (states.indexOf('S') > -1) return 'S - success'
  if (states.indexOf('F') > -1) return 'F - failure'
  return 'I - initial'
}

const FtpClientPanel = ({ configuration, datamodel, commands, log, onEvent }) => {
  const states = configuration || []
  const currentCommand = datamodel && datamodel.currentCommand ? datamodel.currentCommand : ''
  const lastReply = datamodel && datamodel.lastReply ? datamodel.lastReply : 'none'
  const commandIndex = datamodel && typeof datamodel.commandIndex !== 'undefined' ? datamodel.commandIndex : 0

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
          FTP state
        </div>
        <h3 style={{ margin: '0.25rem 0' }}>{stateLabel(states)}</h3>
        <div>Current command: {currentCommand || 'none'}</div>
        <div>Last reply: {lastReply}</div>
        <div>Command index: {commandIndex}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button className="btn btn-primary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent('control.opened')}>
          Open control channel
        </button>
        <button className="btn btn-success" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent({ name: 'reply.2xx', data: '200 OK' })}>
          2xx reply
        </button>
        <button className="btn btn-secondary" style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }} onClick={() => onEvent({ name: 'reply.3xx', data: '331 Password required' })}>
          3xx password
        </button>
        <button className="btn btn-danger" style={{ marginBottom: '0.5rem' }} onClick={() => onEvent({ name: 'reply.5xx', data: '550 File unavailable' })}>
          5xx failure
        </button>
      </div>

      <strong>Commands sent</strong>
      <div style={{ margin: '0.5rem 0 1rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
        {(commands || []).map((command, index) => (
          <div key={`${command}-${index}`}>{command}</div>
        ))}
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

export default FtpClientPanel

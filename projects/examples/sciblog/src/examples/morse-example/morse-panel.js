import React from 'react'

const MorsePanel = ({ configuration, datamodel, transcript, signals, onPress, onRelease, onPulse, onRestart }) => {
  const states = configuration || []
  const isPressed = states.indexOf('pressed') > -1
  const buffer = datamodel && datamodel.buffer ? datamodel.buffer : ''

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f6f6f6' }}>
      <div style={{ minHeight: '7rem', background: '#202124', color: '#f2f2f2', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#9aa0a6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Decoded text</div>
        <div style={{ fontFamily: 'monospace', fontSize: '2rem', lineHeight: '2.5rem', wordBreak: 'break-word' }}>
          {transcript || '\u00a0'}
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Current code</strong>
        <div style={{ fontFamily: 'monospace', fontSize: '1.75rem', minHeight: '2.5rem' }}>
          {buffer || '\u00a0'}
        </div>
      </div>

      <button
        className={isPressed ? 'btn btn-danger' : 'btn btn-primary'}
        style={{ width: '100%', height: '4rem', marginBottom: '0.75rem', fontSize: '1.25rem' }}
        onMouseDown={onPress}
        onMouseUp={onRelease}
        onMouseLeave={isPressed ? onRelease : undefined}
        onTouchStart={onPress}
        onTouchEnd={onRelease}
      >
        {isPressed ? 'Release key' : 'Hold key'}
      </button>

      <div style={{ display: 'flex', marginBottom: '0.75rem' }}>
        <button className="btn btn-secondary" style={{ flex: 1, marginRight: '0.5rem' }} onClick={() => onPulse(100)}>
          Dot
        </button>
        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onPulse(420)}>
          Dash
        </button>
      </div>

      <button className="btn btn-light" style={{ width: '100%', marginBottom: '1rem' }} onClick={onRestart}>
        Restart
      </button>

      <div>
        <strong>Signals</strong>
        <div style={{ fontFamily: 'monospace', minHeight: '4rem', color: '#555' }}>
          {signals.join(' ') || '\u00a0'}
        </div>
      </div>
    </div>
  )
}

export default MorsePanel

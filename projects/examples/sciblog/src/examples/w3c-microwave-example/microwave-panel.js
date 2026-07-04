import React from 'react'

const buttonStyle = {
  margin: '0 0.5rem 0.5rem 0',
}

const statStyle = {
  display: 'inline-block',
  minWidth: '7rem',
  marginRight: '1rem',
  padding: '0.5rem 0',
}

const MicrowavePanel = ({ sc, configuration, datamodel }) => {
  const states = configuration || []
  const isOff = states.indexOf('off') > -1
  const isIdle = states.indexOf('idle') > -1
  const isCooking = states.indexOf('cooking') > -1
  const timer = datamodel && typeof datamodel.timer !== 'undefined' ? datamodel.timer : 0
  const cookTime = datamodel && datamodel.cook_time ? datamodel.cook_time : 5
  const doorClosed = !datamodel || datamodel.door_closed !== false

  return (
    <div style={{ padding: '1rem', height: '100%', background: '#f7f7f7' }}>
      <div
        style={{
          height: '13rem',
          border: '8px solid #444',
          background: isOff ? '#222' : isCooking ? '#ffc857' : '#dceefb',
          position: 'relative',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '1rem',
            right: '5rem',
            top: '1rem',
            bottom: '1rem',
            border: doorClosed ? '4px solid #111' : '4px solid #1976d2',
            background: doorClosed ? 'rgba(255,255,255,0.25)' : '#fff',
            transform: doorClosed ? 'none' : 'skewY(-6deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '1rem',
            width: '3.5rem',
            bottom: '1rem',
            background: '#2e2e2e',
            color: '#eee',
            padding: '0.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontFamily: 'monospace' }}>{timer}</div>
          <div style={{ fontSize: '0.75rem' }}>sec</div>
        </div>
      </div>

      <div>
        <span style={statStyle}><strong>Power</strong><br />{isOff ? 'off' : 'on'}</span>
        <span style={statStyle}><strong>Mode</strong><br />{isCooking ? 'cooking' : isIdle ? 'idle' : 'off'}</span>
        <span style={statStyle}><strong>Door</strong><br />{doorClosed ? 'closed' : 'open'}</span>
        <span style={statStyle}><strong>Timer</strong><br />{timer} / {cookTime}</span>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button className="btn btn-primary" style={buttonStyle} onClick={() => sc && sc.gen('turn.on')}>
          Turn on
        </button>
        <button className="btn btn-secondary" style={buttonStyle} onClick={() => sc && sc.gen('turn.off')}>
          Turn off
        </button>
        <button className="btn btn-info" style={buttonStyle} onClick={() => sc && sc.gen('door.open')}>
          Open door
        </button>
        <button className="btn btn-info" style={buttonStyle} onClick={() => sc && sc.gen('door.close')}>
          Close door
        </button>
        <button className="btn btn-success" style={buttonStyle} onClick={() => sc && sc.gen('time')}>
          Tick
        </button>
      </div>
    </div>
  )
}

export default MicrowavePanel

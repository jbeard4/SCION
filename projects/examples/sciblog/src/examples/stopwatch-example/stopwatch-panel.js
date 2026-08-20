import React from 'react'

const lapDuration = (startTime, endTime) => `${startTime} - ${endTime}`

const StopWatchPanel = ({ configuration, display, laps, onButton1, onButton2 }) => {
  const states = configuration || []
  const isReady = states.indexOf('ready') > -1
  const isActive = states.indexOf('active') > -1
  const isPaused = states.indexOf('pause') > -1

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f6f6f6' }}>
      <div style={{ minHeight: '16rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '3rem', lineHeight: '3.25rem' }}>
          {display.ElapsedMS}
        </div>
        {!isReady &&
          <div style={{ fontFamily: 'monospace', fontSize: '1.25rem', color: '#666' }}>
            {display.LapMS}
          </div>}
        <div style={{ marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#777' }}>
          {isReady ? 'ready' : isActive ? 'running' : isPaused ? 'paused' : 'loading'}
        </div>
      </div>

      {laps.length > 0 &&
        <div style={{ maxHeight: '14rem', overflow: 'auto', marginBottom: '1rem' }}>
          {
            laps.map(lap => (
              <div key={lap.lapIndex} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #ddd' }}>
                <strong>Lap {lap.lapIndex}</strong>
                <span style={{ fontFamily: 'monospace' }}>{lapDuration(lap.startTime, lap.endTime)}</span>
              </div>
            ))
          }
        </div>}

      <div style={{ display: 'flex' }}>
        <button
          className={isActive ? 'btn btn-danger' : 'btn btn-success'}
          style={{ flex: 1, marginRight: '0.5rem', height: '3rem' }}
          onClick={onButton1}
        >
          {isReady ? 'Start' : isActive ? 'Pause' : 'Resume'}
        </button>
        {!isReady &&
          <button
            className={isActive ? 'btn btn-info' : 'btn btn-primary'}
            style={{ flex: 1, height: '3rem' }}
            onClick={onButton2}
          >
            {isActive ? 'Lap' : 'Reset'}
          </button>}
      </div>
    </div>
  )
}

export default StopWatchPanel

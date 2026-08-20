import React from 'react'

const philosophers = [
  { id: 1, forks: [1, 5] },
  { id: 2, forks: [1, 2] },
  { id: 3, forks: [2, 3] },
  { id: 4, forks: [3, 4] },
  { id: 5, forks: [4, 5] },
]

const getPhase = (states, id) => {
  if (states.indexOf(`P${id}_Eating`) > -1) return 'eating'
  if (states.indexOf(`P${id}_HasFirst`) > -1) return 'holding one'
  if (states.indexOf(`P${id}_Hungry`) > -1) return 'hungry'
  return 'thinking'
}

const phaseStyle = phase => {
  if (phase === 'eating') return { background: '#1f7a4d', color: '#fff' }
  if (phase === 'holding one') return { background: '#f2b84b', color: '#2b210f' }
  if (phase === 'hungry') return { background: '#d9534f', color: '#fff' }
  return { background: '#e9ecef', color: '#333' }
}

const DiningPhilosophersPanel = ({ configuration, datamodel, log, onEvent, onReset }) => {
  const states = configuration || []
  const forks = datamodel && datamodel.forks ? datamodel.forks : [0, 0, 0, 0, 0, 0]
  const eatCount = datamodel && datamodel.eatCount ? datamodel.eatCount : [0, 0, 0, 0, 0, 0]

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Dining table</h3>
        <button className="btn btn-light btn-sm" onClick={onReset}>Reset</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
        {[1, 2, 3, 4, 5].map(id => (
          <div key={id} style={{ background: '#fff', border: '1px solid #ddd', padding: '0.45rem', textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>Fork {id}</div>
            <div>{forks[id] ? `P${forks[id]}` : 'free'}</div>
          </div>
        ))}
      </div>

      {philosophers.map(({ id, forks: pair }) => {
        const phase = getPhase(states, id)
        return (
          <div key={id} style={{ background: '#fff', border: '1px solid #ddd', padding: '0.75rem', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <strong>Philosopher {id}</strong>
              <span style={Object.assign({ borderRadius: '2px', padding: '0.2rem 0.45rem', fontSize: '0.8rem' }, phaseStyle(phase))}>
                {phase}
              </span>
            </div>
            <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Uses forks {pair[0]} and {pair[1]}; has eaten {eatCount[id] || 0} time{eatCount[id] === 1 ? '' : 's'}.
            </div>
            <button
              className="btn btn-primary btn-sm"
              style={{ marginRight: '0.35rem' }}
              disabled={phase !== 'thinking'}
              onClick={() => onEvent(`hungry.${id}`)}
            >
              Hungry
            </button>
            <button
              className="btn btn-secondary btn-sm"
              style={{ marginRight: '0.35rem' }}
              disabled={phase === 'thinking' || phase === 'eating'}
              onClick={() => onEvent(`retry.${id}`)}
            >
              Retry
            </button>
            <button
              className="btn btn-success btn-sm"
              disabled={phase !== 'eating'}
              onClick={() => onEvent(`done.${id}`)}
            >
              Done eating
            </button>
          </div>
        )
      })}

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

export default DiningPhilosophersPanel

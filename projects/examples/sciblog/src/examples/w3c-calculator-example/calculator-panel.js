import React from 'react'

const keys = [
  ['C', 'OPER.DIV', 'OPER.STAR', 'OPER.MINUS'],
  ['DIGIT.7', 'DIGIT.8', 'DIGIT.9', 'OPER.PLUS'],
  ['DIGIT.4', 'DIGIT.5', 'DIGIT.6', 'EQUALS'],
  ['DIGIT.1', 'DIGIT.2', 'DIGIT.3', 'POINT'],
  ['DIGIT.0'],
]

const labels = {
  C: 'C',
  'OPER.DIV': '/',
  'OPER.STAR': '*',
  'OPER.MINUS': '-',
  'OPER.PLUS': '+',
  EQUALS: '=',
  POINT: '.',
}

const keyLabel = event => labels[event] || event.replace('DIGIT.', '')

const CalculatorPanel = ({ sc, datamodel }) => {
  const shortExpr = datamodel && datamodel.short_expr
  const res = datamodel && typeof datamodel.res !== 'undefined' ? datamodel.res : 0
  const longExpr = datamodel && datamodel.long_expr ? datamodel.long_expr : ''
  const display = shortExpr === '' || typeof shortExpr === 'undefined' ? res : shortExpr

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f6f6f6' }}>
      <div
        style={{
          minHeight: '4rem',
          marginBottom: '0.75rem',
          padding: '0.75rem',
          background: '#202124',
          color: '#f2f2f2',
          textAlign: 'right',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ minHeight: '1rem', color: '#9aa0a6', fontSize: '0.875rem', overflow: 'hidden' }}>
          {longExpr || '\u00a0'}
        </div>
        <div style={{ fontSize: '2rem', lineHeight: '2.25rem', wordBreak: 'break-all' }}>{display}</div>
      </div>

      <div>
        {
          keys.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {
                row.map(event => (
                  <button
                    key={event}
                    className={event === 'EQUALS' ? 'btn btn-success' : event.indexOf('OPER.') === 0 ? 'btn btn-info' : 'btn btn-secondary'}
                    style={{
                      flex: event === 'DIGIT.0' ? '0 0 calc(50% - 0.5rem)' : '1 1 0',
                      margin: '0.25rem',
                      height: '3rem',
                      fontSize: '1.1rem',
                    }}
                    onClick={() => sc && sc.gen(event)}
                  >
                    {keyLabel(event)}
                  </button>
                ))
              }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default CalculatorPanel

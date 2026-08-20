import React from 'react'

const actionByState = [
  { state: 'receiveOrder', label: 'Receive order', event: 'order.received' },
  { state: 'validateOrder', label: 'Order valid', event: 'order.valid', secondaryLabel: 'Order invalid', secondaryEvent: 'order.invalid' },
  { state: 'checkInventory', label: 'Inventory available', event: 'inventory.available', secondaryLabel: 'Backorder', secondaryEvent: 'inventory.unavailable' },
  { state: 'backorder', label: 'Inventory arrived', event: 'inventory.available', secondaryLabel: 'Customer cancels', secondaryEvent: 'customer.cancel' },
  { state: 'authorizePayment', label: 'Payment approved', event: 'payment.approved', secondaryLabel: 'Payment declined', secondaryEvent: 'payment.declined' },
  { state: 'pickAndPack', label: 'Package ready', event: 'package.ready' },
  { state: 'shipOrder', label: 'Shipment sent', event: 'shipment.sent' },
]

const activeActions = configuration => {
  const states = configuration || []
  return actionByState.filter(action => states.indexOf(action.state) > -1)
}

const BusinessProcessPanel = ({ configuration, datamodel, log, onEvent, onReset }) => {
  const states = configuration || []
  const actions = activeActions(states)
  const isComplete = states.indexOf('completed') > -1
  const isCancelled = states.indexOf('cancelled') > -1
  const orderStatus = datamodel && datamodel.orderStatus ? datamodel.orderStatus : 'loading'
  const paymentStatus = datamodel && datamodel.paymentStatus ? datamodel.paymentStatus : 'not started'
  const warehouseStatus = datamodel && datamodel.warehouseStatus ? datamodel.warehouseStatus : 'not started'

  return (
    <div style={{ height: '100%', padding: '1rem', background: '#f7f7f7', overflow: 'auto' }}>
      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#666', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
          Process status
        </div>
        <h3 style={{ margin: '0.25rem 0' }}>{isComplete ? 'completed' : isCancelled ? 'cancelled' : orderStatus}</h3>
        <div>Payment: {paymentStatus}</div>
        <div>Warehouse: {warehouseStatus}</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        {actions.map(action => (
          <div key={action.state} style={{ marginBottom: '0.5rem' }}>
            <button className="btn btn-primary" style={{ marginRight: '0.5rem', marginBottom: '0.35rem' }} onClick={() => onEvent(action.event)}>
              {action.label}
            </button>
            {action.secondaryEvent &&
              <button className="btn btn-secondary" style={{ marginBottom: '0.35rem' }} onClick={() => onEvent(action.secondaryEvent)}>
                {action.secondaryLabel}
              </button>}
          </div>
        ))}
        <button className="btn btn-light" onClick={onReset}>Reset</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Active states</strong>
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

export default BusinessProcessPanel

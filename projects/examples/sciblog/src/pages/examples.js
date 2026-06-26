import React from 'react'
import Link from 'gatsby-link'

const examples = [
  {
    title: 'Nancy Drew Vampire Tutorial',
    href: '/tutorials/fundamentals',
    description: 'A guided tutorial showing how SCXML models a small event-driven character state machine.'
  },
  {
    title: 'Light Switch',
    href: '/tutorials/introduction',
    description: 'A first example of using events and states to model simple behavior.'
  },
  {
    title: 'Compound States',
    href: '/tutorials/compound-states',
    description: 'Examples showing how hierarchy makes larger state machines easier to model.'
  },
  {
    title: 'History States',
    href: '/tutorials/history',
    description: 'Examples of restoring a previous nested state with SCXML history.'
  }
]

const Examples = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', padding: '1em 0' }}>Examples</h1>
    <p>
      This site will collect standalone SCXML examples over time. For now, the
      tutorial includes runnable examples powered by SCION.
    </p>
    <div className="row">
      {
        examples.map(example => (
          <div className="col-md-6" key={example.title} style={{ marginBottom: '1.5rem' }}>
            <h2><Link to={example.href}>{example.title}</Link></h2>
            <p>{example.description}</p>
          </div>
        ))
      }
    </div>
  </div>
)

export default Examples

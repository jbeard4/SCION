import React from 'react'
import Link from 'gatsby-link'

const sections = [
  {
    title: 'Thure tutorials',
    description: 'The original guided SCXML tutorial examples, updated to run in the browser with SCION.',
    examples: [
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
  },
  {
    title: 'Ported SCXML tutorials',
    description: 'Runnable SCION, SCHVIZ, and React ports of examples collected by Alex Zhornyak.',
    examples: [
      {
        title: 'W3C Microwave',
        href: '/tutorials/examples/microwave',
        description: 'A live version of the W3C microwave oven statechart with SCHVIZ and an executable HTML5 appliance panel.'
      },
      {
        title: 'W3C Microwave Parallel',
        href: '/tutorials/examples/microwave-parallel',
        description: 'A parallel-state microwave oven that separates engine and door behavior while keeping the HTML5 panel executable.'
      }
    ]
  }
]

const Examples = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', padding: '1em 0' }}>Examples</h1>
    <p>
      Browse runnable SCXML examples powered by SCION. Each example pairs a statechart with an executable
      browser interface so the model can be inspected and exercised directly.
    </p>
    {
      sections.map(section => (
        <section key={section.title} style={{ marginTop: '2rem' }}>
          <h2>{section.title}</h2>
          <p>{section.description}</p>
          <div className="row">
            {
              section.examples.map(example => (
                <div className="col-md-6" key={example.title} style={{ marginBottom: '1.5rem' }}>
                  <h3><Link to={example.href}>{example.title}</Link></h3>
                  <p>{example.description}</p>
                </div>
              ))
            }
          </div>
        </section>
      ))
    }
  </div>
)

export default Examples

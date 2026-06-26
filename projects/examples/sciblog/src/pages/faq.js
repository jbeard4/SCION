import React from 'react'

const Faq = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', padding: '1em 0' }}>FAQ</h1>

    <h2>What are state machines?</h2>
    <p>
      State machines describe systems in terms of states and transitions between
      those states. Transitions are triggered by events, and they define how a
      system moves from one state to another.
    </p>

    <h2>What are statecharts?</h2>
    <p>
      Statecharts extend state machines with hierarchy and concurrency. They are
      useful when behavior has nested modes, parallel regions, or event-driven
      control flow that is hard to keep clear in ordinary conditional code.
    </p>

    <h2>What is SCXML?</h2>
    <p>
      SCXML is a <a href="https://www.w3.org/TR/scxml/">W3C standard</a> for
      representing statecharts in XML. The standard defines both a document
      format and execution semantics for interpreting those documents.
    </p>

    <h2>What is this website?</h2>
    <p>
      This is an open source informational site about SCXML and hierarchical
      state machines. It is not affiliated with W3C. The examples and tutorial
      material are powered by SCION.
    </p>

    <h2>How should I get started?</h2>
    <p>
      Start with the <a href="/tutorials/fundamentals">tutorial</a>, then look
      at the examples and tooling pages as more resources are added.
    </p>
  </div>
)

export default Faq

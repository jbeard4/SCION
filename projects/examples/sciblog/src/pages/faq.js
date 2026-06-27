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
    <p>
      A running state machine has a current state. When an event is dispatched
      into the machine, the machine checks the transitions that are valid from
      that state and, if one matches, moves to the next state.
    </p>
    <p>
      State machines are a kind of language. The states and transitions are the
      syntax; the rules for executing them are the semantics. Different state
      machine formalisms define different semantics. SCXML defines its execution
      semantics in the W3C standard.
    </p>

    <h2>What are statecharts?</h2>
    <p>
      Statecharts extend state machines with hierarchy and concurrency. They are
      useful when behavior has nested modes, parallel regions, or event-driven
      control flow that is hard to keep clear in ordinary conditional code.
    </p>
    <p>
      Hierarchy lets a model group related states under a parent state. That can
      remove duplication because common behavior can be described once on the
      parent instead of repeated on every child. Concurrency lets a model
      describe independent regions that are active at the same time.
    </p>

    <h2>What is SCXML?</h2>
    <p>
      SCXML is a <a href="https://www.w3.org/TR/scxml/">W3C standard</a> for
      representing statecharts in XML. The standard defines both a document
      format and execution semantics for interpreting those documents.
    </p>
    <p>
      SCXML documents can describe states, transitions, events, executable
      actions, data, history states, parallel states, and communication with
      external systems. It is useful when application behavior should be
      explicit, inspectable, and portable across tools.
    </p>

    <h2>What are SCXML and statecharts used for?</h2>
    <p>
      SCXML and statecharts can be used wherever software has well-defined
      modes and event-driven behavior. Common domains include user interfaces,
      embedded systems, workflow orchestration, interaction design, telephony,
      customer-service flows, and application coordination logic.
    </p>
    <p>
      They are especially helpful when a system's behavior is easier to
      understand as a set of states and transitions than as scattered
      conditional logic.
    </p>

    <h2>What is SCION?</h2>
    <p>
      SCION is an open source JavaScript implementation and tooling ecosystem
      for SCXML. It powers the examples and visualizations on this site.
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
    <p>
      If you are already familiar with state machines, the tutorial is still a
      useful path through SCXML-specific concepts such as compound states,
      conditional transitions, and history states.
    </p>
  </div>
)

export default Faq

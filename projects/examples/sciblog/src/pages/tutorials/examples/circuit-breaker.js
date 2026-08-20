import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import CircuitBreakerExample, { circuitBreakerScxml } from '../../../examples/circuit-breaker-example'

const CircuitBreaker = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This example models the circuit breaker resilience pattern. The statechart keeps calls flowing while
      closed, fails fast while open, and uses a half-open probe to decide whether the dependency has recovered.
    </p>

    <CircuitBreakerExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {circuitBreakerScxml}
    </PrismCode>
  </div>
)

const WrappedCircuitBreaker = ({ location }) => (
  <TutorialPageWrapper Component={CircuitBreaker} pathname={location.pathname} />
)

export default WrappedCircuitBreaker

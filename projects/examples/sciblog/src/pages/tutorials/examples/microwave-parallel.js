import * as React from 'react'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import W3CMicrowaveParallelExample, { microwaveParallelScxml } from '../../../examples/w3c-microwave-parallel-example'

const MicrowaveParallel = ({ sectionName, by }) => (
  <div className="container">
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports the W3C microwave oven parallel example from Alex Zhornyak&apos;s SCXML tutorial collection.
      The statechart separates the oven engine from the door region and uses the SCXML <code>In()</code>
      predicate to coordinate them.
    </p>

    <W3CMicrowaveParallelExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {microwaveParallelScxml}
    </PrismCode>
  </div>
)

const WrappedMicrowaveParallel = ({ location }) => (
  <TutorialPageWrapper Component={MicrowaveParallel} pathname={location.pathname} />
)

export default WrappedMicrowaveParallel

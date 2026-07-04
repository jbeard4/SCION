import * as React from 'react'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import W3CMicrowaveExample, { microwaveScxml } from '../../../examples/w3c-microwave-example'

const Microwave = ({ sectionName, by }) => (
  <div className="container">
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports the W3C microwave oven example from Alex Zhornyak&apos;s SCXML tutorial collection into a
      browser-executable SCION example. The left pane shows the live statechart, and the right pane is an
      HTML5 microwave panel that sends SCXML events.
    </p>

    <W3CMicrowaveExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {microwaveScxml}
    </PrismCode>
  </div>
)

const WrappedMicrowave = ({ location }) => (
  <TutorialPageWrapper Component={Microwave} pathname={location.pathname} />
)

export default WrappedMicrowave

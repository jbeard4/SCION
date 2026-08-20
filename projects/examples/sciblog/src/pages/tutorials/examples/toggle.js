import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import XStateToggleExample, { toggleScxml } from '../../../examples/xstate-toggle-example'

const Toggle = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports Stately&apos;s XState Toggle example into SCXML. It keeps the same small two-state shape
      while adding explicit set and reset events for the live browser panel.
    </p>

    <XStateToggleExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {toggleScxml}
    </PrismCode>
  </div>
)

const WrappedToggle = ({ location }) => (
  <TutorialPageWrapper Component={Toggle} pathname={location.pathname} />
)

export default WrappedToggle

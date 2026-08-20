import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import XStateFetchExample, { fetchScxml } from '../../../examples/xstate-fetch-example'

const Fetch = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports the shape of Stately&apos;s XState simple fetch example into SCXML. The machine covers idle,
      loading, success, and failure states, with retry, cancel, and reset events exposed in the browser panel.
    </p>

    <XStateFetchExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {fetchScxml}
    </PrismCode>
  </div>
)

const WrappedFetch = ({ location }) => (
  <TutorialPageWrapper Component={Fetch} pathname={location.pathname} />
)

export default WrappedFetch

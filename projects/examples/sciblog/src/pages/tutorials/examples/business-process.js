import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import BusinessProcessExample, { businessProcessScxml } from '../../../examples/business-process-example'

const BusinessProcess = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This is a BPMN-style order fulfillment process modeled in SCXML. It uses event, activity, gateway, and
      parallel-flow concepts from Business Process Model and Notation, then makes the flow executable in SCION.
    </p>

    <BusinessProcessExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {businessProcessScxml}
    </PrismCode>
  </div>
)

const WrappedBusinessProcess = ({ location }) => (
  <TutorialPageWrapper Component={BusinessProcess} pathname={location.pathname} />
)

export default WrappedBusinessProcess

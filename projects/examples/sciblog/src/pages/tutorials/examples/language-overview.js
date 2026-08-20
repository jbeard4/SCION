import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import W3CLanguageOverviewExample, { languageOverviewScxml } from '../../../examples/w3c-language-overview-example'

const LanguageOverview = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports the W3C SCXML Language Overview into a runnable browser example. The external include is
      inlined, and the external CCXML/VoiceXML portion is represented by browser-driven events so the whole
      flow can run in SCION.
    </p>

    <W3CLanguageOverviewExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {languageOverviewScxml}
    </PrismCode>
  </div>
)

const WrappedLanguageOverview = ({ location }) => (
  <TutorialPageWrapper Component={LanguageOverview} pathname={location.pathname} />
)

export default WrappedLanguageOverview

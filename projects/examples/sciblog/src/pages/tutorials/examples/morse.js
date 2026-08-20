import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import MorseExample, { morseScxml } from '../../../examples/morse-example'

const Morse = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports Alex Zhornyak&apos;s Qt SCXML Morse Code Trainer EcmaScript example. The SCXML statechart
      distinguishes dot, dash, short pause, and long pause timing, while the React panel provides a browser
      keyer and decoded transcript.
    </p>

    <MorseExample />

    <h2>Hardware demo</h2>
    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', background: '#111', marginBottom: '2rem' }}>
      <iframe
        title="Morse hardware demo"
        src="https://www.youtube.com/embed/7S-blsAqt_U"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {morseScxml}
    </PrismCode>
  </div>
)

const WrappedMorse = ({ location }) => (
  <TutorialPageWrapper Component={Morse} pathname={location.pathname} />
)

export default WrappedMorse

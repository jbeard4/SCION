import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import StopWatchExample, { stopwatchScxml } from '../../../examples/stopwatch-example'

const StopWatch = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports Alex Zhornyak&apos;s Qt QML SCXML stopwatch example into a browser executable SCION example.
      The statechart handles start, pause, resume, reset, lap capture, and scheduled display updates.
    </p>

    <StopWatchExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {stopwatchScxml}
    </PrismCode>
  </div>
)

const WrappedStopWatch = ({ location }) => (
  <TutorialPageWrapper Component={StopWatch} pathname={location.pathname} />
)

export default WrappedStopWatch

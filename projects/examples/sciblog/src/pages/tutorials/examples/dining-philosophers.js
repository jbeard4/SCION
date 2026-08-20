import * as React from 'react'
import Prism from 'prismjs'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import DiningPhilosophersExample, { diningPhilosophersScxml } from '../../../examples/dining-philosophers-example'

const DiningPhilosophers = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports Alex Zhornyak&apos;s Qt Dining Philosophers example into a live browser model. The chart
      demonstrates Dijkstra&apos;s resource hierarchy solution by requiring each philosopher to acquire the
      lower-numbered fork before the higher-numbered fork.
    </p>

    <DiningPhilosophersExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {diningPhilosophersScxml}
    </PrismCode>
  </div>
)

const WrappedDiningPhilosophers = ({ location }) => (
  <TutorialPageWrapper Component={DiningPhilosophers} pathname={location.pathname} />
)

export default WrappedDiningPhilosophers

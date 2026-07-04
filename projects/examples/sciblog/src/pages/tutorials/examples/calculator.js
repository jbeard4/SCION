import * as React from 'react'
import PrismCode from 'react-prism'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import W3CCalculatorExample, { calculatorScxml } from '../../../examples/w3c-calculator-example'

const Calculator = ({ sectionName, by }) => (
  <div>
    <h1>{sectionName}</h1>
    <h6>{by}</h6>

    <p>
      This ports the W3C calculator example from Alex Zhornyak&apos;s SCXML tutorial collection. The SCXML
      statechart manages operand entry, operators, decimal points, negation, and result submission while
      the React panel sends calculator events.
    </p>

    <W3CCalculatorExample />

    <h2>SCXML source</h2>
    <PrismCode component="pre" className="language-xml">
      {calculatorScxml}
    </PrismCode>
  </div>
)

const WrappedCalculator = ({ location }) => (
  <TutorialPageWrapper Component={Calculator} pathname={location.pathname} />
)

export default WrappedCalculator

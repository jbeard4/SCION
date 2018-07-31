import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import { LightSwitchExample, lampScxml } from './light-switch-example'
import { TwoButtonLightSwitchExample } from './two-button-lamp'
import Prism from 'prismjs'
import PrismCode from 'react-prism'

const Introduction = ({sectionName, by}) => (
  <div className="container">
  <h1>{sectionName}</h1>
  <h6>{by}</h6>

<h2>What is a state machine?</h2>

<p>A state machine can be thought of as a graph, with nodes, and edges connecting those nodes. The nodes are called <strong>states</strong>, and the edges are called <strong>transitions</strong>. Transitions are associated with named <strong>events</strong>. When you execute the state machine, you create a new state machine <strong>instance</strong>, and that instance has a particular <strong>configuration</strong> of states, which is a Set of state ids that the instance is currently in. The state machine receives events, selects transitions from those events, and then flows along the transitions from source to target states, and updates its configuration to the set of target states.</p>

<h2>Example: a light switch</h2>

<p>Let’s say you have a light switch. Whenever you touch it, it turns on if it was off and off if it was on.</p>

<p>So you have two states: <strong>on</strong> and <strong>off</strong>. You also have one event: <strong>touch</strong>. You can organize this into a statechart like so:</p>

<LightSwitchExample />

<h2>Example: two buttons, one light</h2>

<p>Now say we have one of those antique light switches that operates a light with two buttons: one for "off", and one for "on". Pressing "off" while the light is already off does nothing, and the same for the converse.</p>

<p>For the buttons we have two events, "switch-off" and "switch-on" respectively. For the light we have two states, "on" and "off". That looks like this:</p>

<TwoButtonLightSwitchExample />

<p>From a design standpoint, this configuration takes a little more effort on the user’s part because the user has to decide what she intends to do, which determines which button to press. But perhaps this light consumes a lot of energy to turn on, so accidentally turning the light off is intentionally designed to require more thought.</p>

</div>
)

const WrappedIntroduction = ({location}) => (
  <TutorialPageWrapper Component={Introduction} pathname={location.pathname} />
);

export default WrappedIntroduction;

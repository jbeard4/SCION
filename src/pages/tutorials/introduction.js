import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import { LightSwitchExample, lampScxml } from './light-switch-example'
import { TwoButtonLightSwitchExample } from './two-button-lamp'
import Prism from 'prismjs'
import PrismCode from 'react-prism'

const Introduction = ({sectionName}) => (
  <div className="container">
  <h1>{sectionName}</h1>

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

<h2> Why is this useful? </h2>

<p>Does your application have well-defined, named states? Does it receive events? Does it flow between states in response to those events? Then state machines might be a good solution for you.</p>

<p>Here are a set of application domains where state machines are often a good fit:</p>

<ul>
  <li> Embedded Systems (for controling safety-critical, embedded logic) </li>
  <li> Interaction design (as a design language for communicating between designers and developers) </li>
  <li> Business Workflows (like flow charts) </li>
  <li> Customer Service (for defining phone trees, IVRs, chatbot, etc.) </li>
</ul>

<p>There are many other domains where state machines are useful. If you have an idea, please consider contributing a tutorial to this guide.</p>

<h2>What is SCXML?</h2>

<p>There are many dialects of state machines out there, and many are proprietary. SCXML is an open standard for state machines by the W3C. It describes an <strong>XML application</strong>, which specifies a syntax (a set of rules that define how you write XML code to define the state machine), and a semantics (a set of rules which describes how the state machine should be executed). The SCXML syntax is formalized by an XML schema definition, and the semantics is defined in pseudocode, and formalized by a test suite.</p>

The SCXML code corresponding to the above example looks like this:

<PrismCode component="pre" className="language-xml">
{lampScxml}
</PrismCode>

<h2>What is SCION?</h2>

<p>SCION is a suite of software libraries for working with SCXML in JavaScript. It provides:</p>

<ul>
<li> compiler and runtime for executing state machines</li>
<li> visualization </li>
<li> lint </li>
<li> graphical debugger </li>
<li> other tools and utilities </li>
</ul>

<p>SCION powers the examples on this site.</p>

</div>
)

const WrappedIntroduction = ({location}) => (
  <TutorialPageWrapper Component={Introduction} pathname={location.pathname} />
);

export default WrappedIntroduction;

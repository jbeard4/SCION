import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'
import { TrafficLightExample } from '../../examples/traffic-light'

const ConditionalTransitions = ({sectionName}) => (
  <div className="container">
  <h1>{sectionName}</h1>

<p>By this point you probably understand generally how statecharts work. In this section we’ll discuss less ubiquitous features of SCXML that nonetheless will come in handy in certain circumstances.</p>

<p>Occasionally a state machine needs to react to an event differently depending on the situation. Are all of the criteria met to transition to this state, or do we need to transition to that state instead?</p>

<p>Let’s consider a situation where we want the logic for a traffic light to be entirely handled by a statechart. The only event the interpreter will receive is <code>"tick"</code>, given at an evenly but arbitrarily spaced interval of time. When the interpreter hears a tick, it may need to change the lights, but it may need to keep its present configuration. How do we decide?</p>

<h2> Enter <code>cond</code> </h2>

<p>The <code>cond</code> attribute lets us specify an expression that the statechart has to evaluate to determine which <code>&lt;transition&gt;</code> to follow. Using <code>cond</code>, we can set up the traffic lights’ statechart this way:</p>

<TrafficLightExample />

<p>While it isn’t time to change lights, we transition to the same state after adding 1 to <code>interval</code>. This is totally legal and a useful pattern in situations where it’s still useful to react to the event without transitioning to a new state. The earlier example in 1.3 used this same pattern to update the position of the element while dragging was still underway.</p>

<p>Using <code>cond</code>, we give the statechart all of the logic pertaining to changing the lights, and it’s only up to the interpreter’s environment to keep track of time by firing <code>"tick"</code> on some interval.</p>

</div>
)

const WrappedConditionalTransitions = ({location}) => (
  <TutorialPageWrapper Component={ConditionalTransitions} pathname={location.pathname} />
);

export default WrappedConditionalTransitions;



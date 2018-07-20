import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'

const Overview = ({sectionName}) => (
  <div className="container">
  <h1>{sectionName}</h1>

    These tutorials are oriented toward SCION, but should run in any standards-compliant SCXML implementation. 

    The examples are taken from the scxml-test-framework and SCXML IRP test suite. 

    <h3>Algorithm for Transition selection</h3>

    <p>When a state machine receives an event, it attempts to select matching transitions. This section describes the rules for selecting transitions.</p>

    <p> A transition is <i>enabled</i> if all of the following conditions are satisfied: </p>
    <ul>
    <li>The transition's source state is in the model's full configuration.</li>
    <li>The transition's event is satisfied, which is defined as the following disjunction:
        <ul>
        <li>The transition does not have an @event property (what Harel called a <i>default transition</i>), or</li>
        <li>The transition has a <i>wildcard trigger</i>, which in SCXML is encoded as the special string "*", or</li>
        <li>One of the events defined in the transition's @event property matches the event being processed</li>
        </ul>
    </li>
    <li>The transition's condition is satisfied, which is defined as the following disjunction:
        <ul>
        <li>The transition does not have a @cond property, or</li>
        <li>The transition has a @cond property, and the condition evaluates to true. </li>
        </ul>
    </li>
    </ul>

    <p>It is possible that multiple transitions can be enabled by an event. A transition is considered <i>priority enabled</i> if it is has higher priority than other transitions that can be executed instead of it. This will be discussed in section TODO.</p>

    <p>The formal definition of these rules can be found in functions <a href="https://www.w3.org/TR/scxml/#selectTransitions">selectTransitions</a> and <a href="https://www.w3.org/TR/scxml/#selectEventlessTransitions">selectEventlessTransitions</a> of the Algorithm for SCXML interpretation.</p>
  </div>

)

const WrappedOverview = ({location}) => (
  <TutorialPageWrapper Component={Overview} pathname={location.pathname} />
);

export default WrappedOverview;

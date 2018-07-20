import * as React from "react";
import Link from 'gatsby-link'
import SCHVIZ from '@jbeard/schviz2'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import basic1 from 'scxml-test-framework/test/basic/basic1.scxml'

const StatesAndTransitions1 = () => (
  <div className="row">
    <div className="col-md-6">
      <p>Consider the following basic example.</p>

      <p>This example consists of two states, a and b, and one transition originating from state a and targeting state b. The transition has an @event property with value t. The initial state is 'a'. </p>

      <p>The initial state is a. The initial state can be specified in 3 ways:</p>
      <ol>
        <li>by an @initial property on the parent state</li>
        <li>by an <code>&lt;initial&gt;</code> state. This allows you to create a transition with action code that gets executed when the initial state is first entered. Actions will be discussed in TODO. </li>
        <li>if the parent state is not a parallel state, then the first child state in document order will be the initial state (parallel states are described in TODO)</li>
      </ol>

      <p>In the graphical syntax, the initial state is indicated by a black dot with a transition targeting the initial state. This syntax is derived from Harel.</p>

      <p>Let's try running the state machine: <Link className="btn btn-primary" to="/tutorials/basic-states-and-transitions/2">Start machine&nbsp;<i className="fa fa-play"></i></Link></p>
    </div>
    <div className="col-md-6">
      <div style={{width:'100%',height:'400px',position:'relative'}}>
      <SCHVIZ 
        scxmlDocumentString={basic1}
        disableAnimation={true}
        disableZoom={true}
        disableZoomAnimation={true}
        />
      </div>
    </div>
  </div>
)

const WrappedStatesAndTransitions1 = ({location}) => (
  <TutorialPageWrapper Component={StatesAndTransitions1} pathname={location.pathname} />
);

export default WrappedStatesAndTransitions1;

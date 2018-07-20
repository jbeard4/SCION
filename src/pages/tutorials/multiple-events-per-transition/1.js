import * as React from "react";
import Link from 'gatsby-link'
import SCHVIZ from '@jbeard/schviz2'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import basic1 from 'scxml-test-framework/test/multiple-events-per-transition/test1.scxml'

const MultipleEventsPerTransition1 = () => (
  <div className="row">
    <div className="col-md-6">
      <p>Each transition can be triggered by possibly multiple events.</p>

      <p>Consider the following basic example.</p>

      <p>This example consists of four states, a, b, c and d, with transitions connecting a to b, b to c, and c to d. Each transition has an @event property with value 'foo bar bat'. The initial state is 'a'. </p>

      <p>Let's try running the state machine: <Link className="btn btn-primary" to="/tutorials/multiple-events-per-transition/2">Start machine&nbsp;<i className="fa fa-play"></i></Link></p>

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

const WrappedMultipleEventsPerTransition1 = ({location}) => (
  <TutorialPageWrapper Component={MultipleEventsPerTransition1} pathname={location.pathname} />
);

export default WrappedMultipleEventsPerTransition1;

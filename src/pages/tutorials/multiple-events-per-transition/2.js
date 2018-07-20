import * as React from "react";
import Link from 'gatsby-link'
import SCHVIZ from '@jbeard/schviz2'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import basic1 from 'scxml-test-framework/test/multiple-events-per-transition/test1.scxml'

const MultipleEventsPerTransition2 = () => (

  <div className="row">
    <div className="col-md-6">
      <p> 
        The initial state is 'a'. You can send it events 'foo', 'bar', or
        'bat' to transition from 'a' to 'b'.
      </p>
      <p>Send event:</p>
      <ul>
        <li><Link className="btn btn-secondary" to="/tutorials/multiple-events-per-transition/3?foo">foo</Link></li>
        <li><Link className="btn btn-secondary" to="/tutorials/multiple-events-per-transition/3?bar">bar</Link></li>
        <li><Link className="btn btn-secondary" to="/tutorials/multiple-events-per-transition/3?bat">bat</Link></li>
      </ul>
    </div>
    <div className="col-md-6">
      <div style={{width:'100%',height:'400px',position:'relative'}}>
        <SCHVIZ 
          scxmlDocumentString={basic1}
          disableAnimation={true}
          configuration={['a']}
          disableZoom={true}
          disableZoomAnimation={true}
          />
      </div>
    </div>
  </div>
)

const WrappedMultipleEventsPerTransition2 = ({location}) => (
  <TutorialPageWrapper Component={MultipleEventsPerTransition2} pathname={location.pathname} />
);

export default WrappedMultipleEventsPerTransition2;

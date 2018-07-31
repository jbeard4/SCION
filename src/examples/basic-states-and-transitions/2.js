import * as React from "react";
import Link from 'gatsby-link'
import SCHVIZ from '@jbeard/schviz2'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import basic1 from 'scxml-test-framework/test/basic/basic1.scxml'

const StatesAndTransitions2 = () => (
  <div className="row">
    <div className="col-md-6">
      <p> You can see that the initial state is highlighted red. The
          highlighted state is the current "acive state. The set of states that are
          active are known as the <i>configuration</i>.
      </p>

      <p> Now, send it event <b>t</b>: <Link className="btn btn-primary" to="/tutorials/basic-states-and-transitions/3">Send event <b>t</b></Link></p>

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

const WrappedStatesAndTransitions2 = ({location}) => (
  <TutorialPageWrapper Component={StatesAndTransitions2} pathname={location.pathname} />
);

export default WrappedStatesAndTransitions2;

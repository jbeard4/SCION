import * as React from "react";
import Link from 'gatsby-link'
import SCHVIZ from '@jbeard/schviz2'
import TutorialPageWrapper from '../../../components/TutorialPageWrapper'
import basic1 from 'scxml-test-framework/test/basic/basic1.scxml'

const StatesAndTransitions3 = () => (
  <div className="row">
    <div className="col-md-6">
      <p> On receiving event <b>t</b>, the transition from a to b is selected, and
          the active state changes from a to b.
      </p>
    </div>
    <div className="col-md-6">
      <div style={{width:'100%',height:'400px',position:'relative'}}>
        <SCHVIZ 
          scxmlDocumentString={basic1}
          disableAnimation={true}
          configuration={['b']}
          disableZoom={true}
          transitionsEnabled={new Map().set('a',new Set([0]))}
          disableZoomAnimation={true}
          />
      </div>
    </div>
  </div>
);

const WrappedStatesAndTransitions3 = ({location}) => (
  <TutorialPageWrapper Component={StatesAndTransitions3} pathname={location.pathname} />
);

export default WrappedStatesAndTransitions3;

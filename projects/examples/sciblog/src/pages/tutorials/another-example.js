import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'

const AnotherExample = ({sectionName}) => (
  <div className="container">
    <h1>{sectionName}</h1>

    <p>This guide is being actively developed, and soon more examples will be posted.</p>

    <p>You can be notified of updates through the following channels:</p>

    <ul>
      <li>Follow <a href="https://twitter.com/scionscxml" target="_blank">@scionscxml</a> on Twitter</li> 
      <li>Chat on <a href="https://gitter.im/SCION-SCXML/Lobby" target="_blank">Gitter</a></li> 
      <li>Subscribe to this website's RSS feed with your preferred RSS client</li>
      <li>Mailing list coming soon.</li>
    </ul>

    <p>Also, this website is fully open source on Github. The project repository is <a href="https://github.com/jbeard4/SCIBLOG">here</a>. if you have an idea for a tutorial, please feel free to submit a pull request on Github.</p>

  </div>

)

const WrappedAnotherExample = ({location}) => (
  <TutorialPageWrapper Component={AnotherExample} pathname={location.pathname} />
);

export default WrappedAnotherExample;


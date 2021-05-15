import * as React from "react";
import TutorialPageWrapper from '../../components/TutorialPageWrapper'

const Introduction = ({sectionName}) => (
<div className="container">

<p>This part of the site is an incomplete guide to SCXML and Statecharts.</p>

</div>
)

const WrappedIntroduction = ({location}) => (
  <TutorialPageWrapper Component={Introduction} pathname={location.pathname} />
);

export default WrappedIntroduction;

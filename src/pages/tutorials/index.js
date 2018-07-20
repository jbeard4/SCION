import * as React from "react";
import Link from 'gatsby-link'

const toc = [
  {
    name : "Tutorial",
    path:"/tutorials/introduction",
  },
  {
    name : "Overview of SCXML",
    path:"/tutorials/basics",
  },
  {
    name : "Basic States and Transitions",
    path:"/tutorials/basic-states-and-transitions",
  },
  {
    name : "Multiple Events Per Transition",
    path:"/tutorials/multiple-events-per-transition",
  },
  {
    name : "Light Switch Example",
    path:"/tutorials/light-switch-example",
  }/*,
  {
    name : "Other",
    path:"/tutorials/other",
  }
  */
];

const Tutorials = ({ children }) => (
  <div className="container-fluid">
    <div className="row">
      <div className="col-md-3">
        <ol>
          {toc.map( (section, i) => <li key={i}><Link to={section.path}>{section.name}</Link></li>)}
        </ol>
      </div>
      <div className="col-md-9">
      </div>
    </div> 
  </div>
);

export default Tutorials;


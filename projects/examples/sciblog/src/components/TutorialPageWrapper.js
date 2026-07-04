import * as React from "react";
import Link from 'gatsby-link'

const thure = <a target="_blank" href="https://github.com/thure">@thure</a>
const by = <span>Based on the tutorials by {thure}.</span>;

const toc = [
  {
    heading: "Thure tutorials",
  },
  {
    name : "Why state machines?",
    path:"/tutorials/fundamentals",
    by
  },
  {
    name : "States & Transitions",
    path:"/tutorials/introduction",
    by
  },
  {
    name : "Doing with SCXML",
    path:"/tutorials/doing-with-scxml",
    by
  },
  {
    name : "Compound States",
    path:"/tutorials/compound-states",
    by
  },
  {
    name : "Conditional Transitions",
    path:"/tutorials/conditional-transitions",
    by
  },
  {
    name : "The History State",
    path:"/tutorials/history",
    by
  },
  {
    name : "Next Steps",
    path:"/tutorials/another-example",
    by
  },
  {
    heading: "Ported SCXML tutorials",
  },
  {
    name : "W3C Microwave",
    path:"/tutorials/examples/microwave",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/#microwave-example">Alex Zhornyak&apos;s SCXML tutorial collection</a>.</span>
  },
  {
    name : "W3C Microwave Parallel",
    path:"/tutorials/examples/microwave-parallel",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/#microwave-example-using-parallel">Alex Zhornyak&apos;s SCXML tutorial collection</a>.</span>
  },
];

const TutorialPageWrapper = ({ Component, pathname }) => {
  const pages = toc.filter(o => o.path)
  let tocIdx = pages.findIndex( (o) => pathname === o.path || pathname === `${o.path}/` ) 
  if(tocIdx === -1){
    tocIdx = 0;
  }
  const curSection = pages[tocIdx];
  const prevSection = pages[tocIdx - 1]
  const nextSection = pages[tocIdx + 1]
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <ol>
            {
              toc.map( ({path, name, heading}, i) => heading ? 
                <li key={heading} style={{listStyleType: 'none', margin: i === 0 ? '0 0 0.5rem' : '1rem 0 0.5rem', fontWeight: 'bold'}}>
                  {heading}
                </li> :
                <li key={path}>
                {
                  path === curSection.path ? 
                    <span>{name}</span> : 
                    <Link to={path}>{name}</Link>
                }
              </li>)
            }
          </ol>
        </div>
        <div className="col-md-9">
          <Component sectionName={curSection.name} by={curSection.by} />
          {prevSection &&
            <Link to={prevSection.path}>&lt; Previous Page ({prevSection.name})</Link>}
          {nextSection &&
            <Link className="float-right" to={nextSection.path}>Next Page ({nextSection.name}) &gt;</Link>}
        </div>
      </div> 
    </div>
  );
}

export default TutorialPageWrapper;

import * as React from "react";
import Link from 'gatsby-link'

const thure = <a target="_blank" href="https://github.com/thure">@thure</a>
const by = <span>Based on the tutorials by {thure}.</span>;

const toc = [
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
    name : "A more advanced example",
    path:"/tutorials/another-example",
    by
  },
];

const TutorialPageWrapper = ({ Component, pathname }) => {
  let tocIdx = toc.findIndex( (o) => pathname.indexOf(o.path) > -1 ) 
  if(tocIdx === -1){
    tocIdx = 0;
  }
  const curSection = toc[tocIdx];
  const prevSection = toc[tocIdx - 1]
  const nextSection = toc[tocIdx + 1]
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <ol>
            {
              toc.map( ({path, name}, i) => <li key={i}>
                {
                  i === tocIdx ? 
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

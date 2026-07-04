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
  {
    name : "W3C Calculator",
    path:"/tutorials/examples/calculator",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/#calculator-example">Alex Zhornyak&apos;s SCXML tutorial collection</a>.</span>
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
      <div style={{ maxWidth: '1500px', margin: '0 auto', padding: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <Link to="/tutorials">Tutorials</Link>
            <span> / </span>
            <Link to="/examples">Examples</Link>
            <span> / {curSection.name}</span>
          </div>
          <div>
            {prevSection &&
              <Link to={prevSection.path} title={`Previous: ${prevSection.name}`} style={{ marginRight: '1rem' }}>
                &larr;
              </Link>}
            {nextSection &&
              <Link to={nextSection.path} title={`Next: ${nextSection.name}`}>
                &rarr;
              </Link>}
          </div>
        </div>
        <Component sectionName={curSection.name} by={curSection.by} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <div>
            {prevSection &&
              <Link to={prevSection.path}>&larr; {prevSection.name}</Link>}
          </div>
          <div>
            {nextSection &&
              <Link to={nextSection.path}>{nextSection.name} &rarr;</Link>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialPageWrapper;

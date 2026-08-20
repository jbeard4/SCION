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
    name : "W3C Language Overview",
    path:"/tutorials/examples/language-overview",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/#language-overview">Alex Zhornyak&apos;s SCXML tutorial collection</a> and the <a target="_blank" href="https://www.w3.org/TR/scxml/#N11608">W3C SCXML Recommendation</a>.</span>
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
  {
    name : "StopWatch",
    path:"/tutorials/examples/stopwatch",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/Qt/StopWatch/">Alex Zhornyak&apos;s SCXML tutorial collection</a>.</span>
  },
  {
    name : "Morse Code Trainer",
    path:"/tutorials/examples/morse",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/Qt/Morse/">Alex Zhornyak&apos;s SCXML tutorial collection</a>.</span>
  },
  {
    name : "Dining Philosophers",
    path:"/tutorials/examples/dining-philosophers",
    by: <span>Ported from <a target="_blank" href="https://alexzhornyak.github.io/SCXML-tutorial/Examples/Qt/DiningPhilosophers/">Alex Zhornyak&apos;s SCXML tutorial collection</a>.</span>
  },
  {
    heading: "Pattern examples",
  },
  {
    name : "Circuit Breaker Pattern",
    path:"/tutorials/examples/circuit-breaker",
    by: <span>A SCION example of the circuit breaker resilience pattern.</span>
  },
  {
    name : "Business Process",
    path:"/tutorials/examples/business-process",
    by: <span>A BPMN-style process inspired by <a target="_blank" href="https://en.wikipedia.org/wiki/Business_Process_Model_and_Notation">Business Process Model and Notation</a>.</span>
  },
  {
    heading: "External example ports",
  },
  {
    name : "Fetch",
    path:"/tutorials/examples/fetch",
    by: <span>Ported from Stately&apos;s <a target="_blank" href="https://stately.ai/docs/examples">XState examples</a> and <a target="_blank" href="https://github.com/statelyai/xstate/tree/main/examples/fetch">fetch example</a>.</span>
  },
  {
    name : "Qt FTP Client",
    path:"/tutorials/examples/ftp-client",
    by: <span>Ported from Qt&apos;s <a target="_blank" href="https://doc.qt.io/qt-6/qtscxml-ftpclient-example.html">SCXML FTP Client example</a>.</span>
  },
  {
    name : "Toggle",
    path:"/tutorials/examples/toggle",
    by: <span>Ported from Stately&apos;s <a target="_blank" href="https://stately.ai/docs/examples">XState Toggle example</a>.</span>
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

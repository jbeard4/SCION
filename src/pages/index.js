import * as React from "react";

const Home = () => (
  <div className="container">
    <div className="jumbotron">
      <div className="container">
        <h1> SCION </h1>
        <h2> <em> n. </em>  A suite of scripts for SCXML/Statechart software system support. </h2>
      </div>
    </div>
    <div className="container">
      <div id="faq" className="container">
        <div className="row">
          <div className="col-md-4">
            <div><i className="fa fa-cog fa-5x"></i></div><h3>What is SCXML?</h3>
            <p>
              <strong>Statecharts</strong> have been used since the 1960s to develop complex  
              user interface behavior for safety-critical embedded systems.
              &nbsp;<strong>SCXML</strong> is an XML application for Statecharts, developed as a
              W3C standard.
            </p>
            <p>
              This website provides a collection of resources (software
              libraries, tools and examples) for development of Statecharts, particularly as
              applied to rapid prototyping of <strong>robust user interfaces</strong>.
            </p>
          </div>
          <div className="col-md-4">
            <div><i className="fa fa-rocket fa-5x"></i></div><h3>Who is it for?</h3>
            <p>
              No matter whether you are a <strong>user experience
              expert</strong>, <strong>an interaction designer</strong>, <strong>a web
              front-end developer</strong>, or an <strong>embedded systems designer</strong>,
              Statecharts allow you to use open web technology rapidly prototype complex user
              interface behavior in your web browser.
            </p>
          </div>
          <div className="col-md-4">
            <div><i className="fa fa-heart fa-5x"></i></div><h3>Why you'll love it</h3>
            <p>
              Does your application have a notion of <strong>state</strong>?
              Does it process <strong>events</strong>, and change state in response to those
              events? Do you think about your application in terms of <strong>flows</strong>? 
              Statecharts let you model the way states change in response to events,
              graphically in your browser, and simulate the resulting UI, which
              which makes designing complex user interface behavior easy.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default Home;

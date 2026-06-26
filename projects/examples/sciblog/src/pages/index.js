import React from 'react'
import Link from 'gatsby-link'

const resources = [
  {
    title: 'FAQ',
    icon: 'fa-question-circle',
    href: '/faq',
    description: 'Start with short answers about state machines, statecharts, SCXML, and this site.'
  },
  {
    title: 'Tutorial',
    icon: 'fa-book',
    href: '/tutorials/fundamentals',
    description: 'Work through the SCXML tutorial and learn the core statechart concepts.'
  },
  {
    title: 'Examples',
    icon: 'fa-code',
    href: '/examples',
    description: 'Browse runnable examples powered by SCION. More SCXML examples will be added over time.'
  },
  {
    title: 'Tooling',
    icon: 'fa-wrench',
    href: '/tooling',
    description: 'Find editors, visualization tools, and SCION Studio information.'
  }
]

const ResourceLink = ({ resource }) => (
  <div className="col-md-3" style={{ marginBottom: '2rem' }}>
    <Link to={resource.href} style={{ color: 'inherit', textDecoration: 'none' }}>
      <div style={{ textAlign: 'center' }}>
        <i className={`fas ${resource.icon} fa-4x`} aria-hidden="true"></i>
        <h3 style={{ marginTop: '1rem' }}>{resource.title}</h3>
        <p>{resource.description}</p>
      </div>
    </Link>
  </div>
)

const Home = () => (
  <div className="container">
    <div className="jumbotron">
      <div className="container">
        <h1>SCXML.IO</h1>
        <p className="lead">
          An open source informational site about the W3C SCXML standard for
          hierarchical state machines and statecharts.
        </p>
        <p>
          This site is not affiliated with W3C. It is powered by{' '}
          <a href="https://github.com/jbeard4/SCION">SCION</a>.
        </p>
      </div>
    </div>

    <div className="container">
      <div className="row">
        {
          resources.map(resource => <ResourceLink key={resource.title} resource={resource} />)
        }
      </div>

      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2>What is SCXML?</h2>
          <p>
            SCXML is an XML-based language for describing statecharts: state
            machines with hierarchy, concurrency, events, and executable
            actions. It is useful for modeling application behavior, workflows,
            interaction logic, and other systems whose behavior changes in
            response to events.
          </p>
          <p>
            This site collects practical resources for learning SCXML and using
            it with SCION. Later, we will add more SCXML examples. One day, we
            will release SCION Studio as well.
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default Home

import React from 'react'
import Link from 'gatsby-link'
import Footer from '../components/Footer'
import './index.css';
import 'prismjs/themes/prism-twilight.css';
import 'jquery';
import '@fortawesome/fontawesome-free/css/all.css';

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    let header = (
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link className="navbar-brand" exact to="/">
          SCXML.IO
        </Link>
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${location.pathname.match(/^\/blog/) ? 'active' : ''}`}>
            <Link className="nav-link" to="/blog">Blog</Link>
          </li>
          <li className={`nav-item ${location.pathname.match(/^\/tutorials/) ? 'active' : ''}`}>
            <Link className="nav-link" to="/tutorials/fundamentals">Tutorial</Link>
          </li>
          <li className={`nav-item ${location.pathname.match(/^\/faq/) ? 'active' : ''}`}>
            <Link className="nav-link" to="/faq">FAQ</Link>
          </li>
          <li className={`nav-item ${location.pathname.match(/^\/examples/) ? 'active' : ''}`}>
            <Link className="nav-link" to="/examples">Examples</Link>
          </li>
          <li className={`nav-item ${location.pathname.match(/^\/tooling/) ? 'active' : ''}`}>
            <Link className="nav-link" to="/tooling">Tooling</Link>
          </li>
        </ul>
      </nav>
    );
    return (
      <div>
        {header}
        <div className="content">
          <div> 
            {children()}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
}

export default Template

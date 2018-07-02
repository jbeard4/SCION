import React from 'react'
import Link from 'gatsby-link'
import './index.css';
import 'prismjs/themes/prism-twilight.css';

class Template extends React.Component {
  render() {
    const { location, children } = this.props
    let header = (
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        {
          location.pathname === '/' && 
            <a href="https://github.com/jbeard4/SCION"><img style={{position: 'absolute', top: 0, right: 0, border: 0, zIndex: 1}} src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png" alt="Fork me on GitHub"/></a>
        }
        <Link className="navbar-brand" exact to="/">
          SCION
        </Link>
        <ul className="navbar-nav mr-auto">
          <li className={`nav-item ${location.pathname === '/blog' ? 'active' : ''}`}>
            <Link className="nav-link" to="/blog">Blog</Link>
          </li>
          <li className={`nav-item ${location.pathname.match(/.html$/) ? 'active' : ''}`}>
            <Link className="nav-link" to="/modules/_workspace_scion_scxml_platform_projects_scion_tsd_index_d_.html">API</Link>
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
        <footer style={{backgroundColor: '#f5f5f5'}}>
          SCION is professionally developed and maintained by Jacobean Research and Development, LLC.
        </footer>
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

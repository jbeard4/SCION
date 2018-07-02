import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import get from 'lodash/get'
import '../docs/assets/css/main.css';


class DocsTemplate extends React.Component {
  render() {
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    const { html } = this.props.pathContext

    return (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    )
  }
}

export default DocsTemplate

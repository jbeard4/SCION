import * as React from "react";
import get from 'lodash/get'
import Link from 'gatsby-link'

const APIDocs = (props) => {
  console.log('files', props.data);
  return <div>foo</div>
}

export default APIDocs;

export const pageQuery = graphql`
  query DocsQuery {
    allFile {
      edges {
        node {
          extension
          dir
          modifiedTime
        }
      }
    }
  }
`

const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = `/blog${createFilePath({ node, getNode })}`
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.modifyWebpackConfig = ({ config, stage }) => {
  config.merge({
    resolve: {
      alias: {
        '@scion-scxml/scxml': path.resolve(__dirname, 'src/vendor/scxml.js'),
        '@scion-scxml/schviz': path.resolve(__dirname, 'src/vendor/schviz.js'),
        '@scion-scxml/react-codemirror': path.resolve(__dirname, 'node_modules/@scion-scxml/react-codemirror/lib/Codemirror.js'),
        '@scion-scxml/codemirror': path.resolve(__dirname, 'node_modules/@scion-scxml/codemirror'),
        '@scion-scxml/scharpie': path.resolve(__dirname, 'src/vendor/scharpie-browser.js'),
        'classnames': path.resolve(__dirname, 'node_modules/classnames'),
        'lodash.isequal': path.resolve(__dirname, 'node_modules/lodash/isEqual.js')
      }
    },
    externals: {
      'module': 'module'
    }
  })

  if(stage === 'develop' || 
      stage === 'develop-html' ||
      stage === 'build-html' ||
      stage === 'build-javascript'){
    config.merge(function(current){
      const entryPointKey = Object.keys(current.entry)[0]
      let entryPoints = current.entry[entryPointKey];
      entryPoints = ['babel-polyfill'].concat(entryPoints); 
      current.entry[entryPointKey] = entryPoints
      return current;
    })
  }
  //const util = require('util');
  //console.log('new config', stage, util.inspect(config.resolve(), {showHidden:true, depth: null}))
  config.loader('raw-loader', {
    // see https://stackoverflow.com/questions/44924751/use-different-loaders-for-files-with-same-extension
    test: /\.((scxml)|(js\?txt))$/
  });
  return config;
};

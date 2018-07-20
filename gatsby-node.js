const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const fs = require('fs');

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    const docsTemplate = path.resolve('./src/templates/docsTemplate.js')
    resolve(
      Promise.all([
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
        }),
        graphql(
          `
            {
              allFile {
                edges {
                  node {
                    fields {
                      html
                    }
                    relativePath
                    internal { 
                      mediaType
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
          result.data.allFile.edges.forEach( edge => {
            if(edge.node.internal.mediaType === 'text/html'){
              createPage({
                path: edge.node.relativePath,
                component: docsTemplate,
                context: {
                  html: edge.node.fields.html,
                },
              })
            }
          })
        }),
      ])
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
  if (node.internal.type === `File` && node.internal.mediaType === 'text/html') {
    const value = createFilePath({ node, getNode })
    const html = fs.readFileSync(node.absolutePath, 'utf8');
    createNodeField({
      name: `html`,
      node,
      value: html,
    })
  }
}

exports.modifyWebpackConfig = ({ config, stage }) => {
  config.merge({
    externals: {
      'module': 'module'
    }
  })
  config.loader('raw-loader', {
    test: /\.scxml$/
  });
  return config;
};

module.exports = {
  siteMetadata: {
    title: 'SCXML.IO',
    author: 'Jacob Beard',
    description: 'Open source information and resources for W3C SCXML, state machines, and statecharts',
    siteUrl: 'https://scxml.io/',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-feed`
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          "gatsby-remark-autolink-headers",
          {
            resolve: 'gatsby-remark-toc',
            options: {
              header: 'Table of Contents',
              include: [
                'src/pages/*/*.md'
              ]
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-121886136-1',
        respectDNT: true,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
  ],
}

import React from 'react'

const tools = [
  {
    title: 'SCION',
    href: 'https://github.com/jbeard4/SCION',
    description: 'Runtime, compiler, visualization, and debugging libraries for working with SCXML in JavaScript.'
  },
  {
    title: 'SCHVIZ',
    href: 'https://www.npmjs.com/package/@scion-scxml/schviz',
    description: 'A visualization component for rendering SCXML statecharts.'
  },
  {
    title: 'VS Code Preview',
    href: 'https://www.npmjs.com/package/@scion-scxml/vscode-preview',
    description: 'A preview extension for visualizing SCXML while editing.'
  },
  {
    title: 'SCION Studio',
    href: 'https://scion.studio',
    description: 'A future editor and tooling environment for SCXML and statecharts.'
  }
]

const Tooling = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', padding: '1em 0' }}>Tooling</h1>
    <p>
      SCXML tooling should make it easier to edit, visualize, run, and debug
      statecharts. This page will collect the editor and visualization resources
      as they become ready.
    </p>
    <div className="row">
      {
        tools.map(tool => (
          <div className="col-md-6" key={tool.title} style={{ marginBottom: '1.5rem' }}>
            <h2><a href={tool.href}>{tool.title}</a></h2>
            <p>{tool.description}</p>
          </div>
        ))
      }
    </div>
  </div>
)

export default Tooling

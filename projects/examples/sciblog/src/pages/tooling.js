import React from 'react'
import CodeMirror from '@scion-scxml/react-codemirror'
import SCHVIZ from '@scion-scxml/schviz'
import scharpie from '@scion-scxml/scharpie'
import SectionSidebar from '../components/SectionSidebar'
import '@scion-scxml/codemirror/lib/codemirror.css'
import './tooling.css'

const initialSCXML = `<scxml
  xmlns="http://www.w3.org/2005/07/scxml"
  version="1.0"
  initial="idle">
  <state id="idle">
    <transition event="cook" target="cooking" />
  </state>
  <state id="cooking">
    <transition event="done" target="idle" />
  </state>
</scxml>`

const sidebarItems = [
  {
    label: 'SCION',
    href: '#scion',
    items: [
      {
        label: 'Online Editor',
        href: '#online-editor',
      },
      {
        label: 'CLI',
        href: 'https://www.npmjs.com/package/@scion-scxml/cli',
      },
      {
        label: 'VS Code Plugin',
        href: 'https://marketplace.visualstudio.com/items?itemName=JacobeanResearchandDevelopmentLLC.vscode-scxml-preview',
      },
      {
        label: 'SCXML Editor',
        href: 'https://alexzhornyak.github.io/ScxmlEditor-Tutorial/',
      },
    ],
  },
]

function getCodeMirrorInstance() {
  if (typeof document === 'undefined') return null

  const codeMirror = require('@scion-scxml/codemirror')
  require('@scion-scxml/codemirror/mode/xml/xml')

  return codeMirror
}

class Tooling extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      code: initialSCXML,
      diagnostics: [],
      visualizedCode: initialSCXML,
    }

    this.editorMarkers = []
    this.errorLines = []
    this.handleCodeChange = this.handleCodeChange.bind(this)
  }

  componentDidMount() {
    this.validateCode(this.state.code)
  }

  componentWillUnmount() {
    window.clearTimeout(this.validationTimer)
    this.clearEditorDiagnostics()
  }

  handleCodeChange(code) {
    this.setState({ code })
    window.clearTimeout(this.validationTimer)
    this.validationTimer = window.setTimeout(() => this.validateCode(code), 250)
  }

  validateCode(code) {
    const diagnostics = scharpie.lintSCXML(code)
    const nextState = { diagnostics }

    if (!diagnostics.length) {
      nextState.visualizedCode = code
    }

    this.setState(nextState, () => this.updateEditorDiagnostics(diagnostics))
  }

  getEditor() {
    return this.editorComponent && this.editorComponent.getCodeMirror()
  }

  clearEditorDiagnostics() {
    const editor = this.getEditor()

    this.editorMarkers.forEach(marker => marker.clear())
    this.editorMarkers = []

    if (editor) {
      this.errorLines.forEach(line =>
        editor.removeLineClass(line, 'background', 'tooling-editor__error-line')
      )
    }

    this.errorLines = []
  }

  updateEditorDiagnostics(diagnostics) {
    const editor = this.getEditor()
    if (!editor) return

    editor.operation(() => {
      this.clearEditorDiagnostics()

      diagnostics.forEach(diagnostic => {
        const line = Math.max((diagnostic.line || 1) - 1, 0)
        const column = Math.max((diagnostic.column || 1) - 1, 0)
        const endColumn = Math.max(diagnostic.endColumn || column + 1, column + 1)

        this.errorLines.push(line)
        editor.addLineClass(line, 'background', 'tooling-editor__error-line')
        this.editorMarkers.push(
          editor.markText(
            { line, ch: column },
            { line, ch: endColumn },
            {
              className: 'tooling-editor__error-text',
              title: diagnostic.message,
            }
          )
        )
      })
    })
  }

  renderDiagnostics() {
    if (!this.state.diagnostics.length) return null

    return (
      <div className="tooling-diagnostics">
        {this.state.diagnostics.map((diagnostic, index) => (
          <p className="tooling-diagnostics__item" key={`${diagnostic.line}-${index}`}>
            <span className="tooling-diagnostics__location">
              {diagnostic.line}:{diagnostic.column}
            </span>
            {diagnostic.message}
          </p>
        ))}
      </div>
    )
  }

  renderVisualizer() {
    if (this.state.diagnostics.length) {
      return (
        <div className="tooling-empty-state">
          Fix the validation errors to update the visualization.
        </div>
      )
    }

    return (
      <div className="tooling-visualizer">
        <SCHVIZ
          scxmlDocumentString={this.state.visualizedCode}
          disableZoomAnimation={true}
          layoutOptions={SCHVIZ.layouts.right}
          redraw={false}
          id="sciblog-tooling-live"
        />
      </div>
    )
  }

  render() {
    const hasErrors = this.state.diagnostics.length > 0

    return (
      <div className="tooling-workspace">
        <div className="tooling-workspace__header">
          <h1>SCXML Tooling</h1>
          <div
            className={
              hasErrors
                ? 'tooling-workspace__status tooling-workspace__status--error'
                : 'tooling-workspace__status'
            }
          >
            {hasErrors
              ? `${this.state.diagnostics.length} validation issue${this.state.diagnostics.length === 1 ? '' : 's'}`
              : 'Valid SCXML'}
          </div>
        </div>

        <div className="section-page">
          <SectionSidebar title="Tooling" items={sidebarItems} />
          <div className="section-page__content">
            <section className="tooling-section" id="scion">
              <h2>SCION</h2>

              <section className="tooling-section__panel" id="online-editor">
                <h3>Online Editor</h3>
                <p>
                  Edit SCXML on the left, validate it as you type, and inspect the live SCHVIZ rendering
                  on the right.
                </p>
                <div className="tooling-workspace__grid">
                  <div className="tooling-panel" id="editor">
                    <div className="tooling-panel__header">
                      <h4 className="tooling-panel__title">Editor</h4>
                    </div>
                    <div className="tooling-panel__body tooling-editor">
                      <CodeMirror
                        ref={component => {
                          this.editorComponent = component
                        }}
                        value={this.state.code}
                        onChange={this.handleCodeChange}
                        codeMirrorInstance={getCodeMirrorInstance()}
                        options={{
                          mode: 'application/xml',
                          lineNumbers: true,
                          lineWrapping: true,
                          tabSize: 2,
                        }}
                      />
                    </div>
                    {this.renderDiagnostics()}
                  </div>

                  <div className="tooling-panel" id="visualization">
                    <div className="tooling-panel__header">
                      <h4 className="tooling-panel__title">Visualization</h4>
                    </div>
                    <div className="tooling-panel__body">
                      {this.renderVisualizer()}
                    </div>
                  </div>
                </div>
              </section>

              <div className="tooling-resource-list">
                <a href="https://www.npmjs.com/package/@scion-scxml/cli">CLI</a>
                <a href="https://marketplace.visualstudio.com/items?itemName=JacobeanResearchandDevelopmentLLC.vscode-scxml-preview">VS Code Plugin</a>
                <a href="https://alexzhornyak.github.io/ScxmlEditor-Tutorial/">SCXML Editor</a>
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default Tooling

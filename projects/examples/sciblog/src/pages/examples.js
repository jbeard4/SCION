import React from 'react'
import Link from 'gatsby-link'
import SectionSidebar from '../components/SectionSidebar'

const ExampleLink = ({ href, children }) => (
  href && href.indexOf('http') === 0 ?
    <a href={href}>{children}</a> :
    <Link to={href}>{children}</Link>
)

const sections = [
  {
    title: 'Videos',
    description: 'Recorded demos of SCION and SCXML examples.',
    examples: [
      {
        title: 'Example Videos',
        href: '/examples/videos',
        description: 'A single page of embedded SCION demo videos, including the Morse code hardware demo.'
      }
    ]
  },
  {
    title: 'Thure tutorials',
    description: 'The original guided SCXML tutorial examples, updated to run in the browser with SCION.',
    examples: [
      {
        title: 'Nancy Drew Vampire Tutorial',
        href: '/tutorials/fundamentals',
        description: 'A guided tutorial showing how SCXML models a small event-driven character state machine.'
      },
      {
        title: 'Light Switch',
        href: '/tutorials/introduction',
        description: 'A first example of using events and states to model simple behavior.'
      },
      {
        title: 'Compound States',
        href: '/tutorials/compound-states',
        description: 'Examples showing how hierarchy makes larger state machines easier to model.'
      },
      {
        title: 'History States',
        href: '/tutorials/history',
        description: 'Examples of restoring a previous nested state with SCXML history.'
      }
    ]
  },
  {
    title: 'Ported SCXML tutorials',
    description: 'Runnable SCION, SCHVIZ, and React ports of examples collected by Alex Zhornyak.',
    examples: [
      {
        title: 'W3C Language Overview',
        href: '/tutorials/examples/language-overview',
        description: 'A browser-compatible adaptation of the W3C overview chart showing nested states, finals, parallel completion, delayed sends, and external events.'
      },
      {
        title: 'W3C Microwave',
        href: '/tutorials/examples/microwave',
        description: 'A live version of the W3C microwave oven statechart with SCHVIZ and an executable HTML5 appliance panel.'
      },
      {
        title: 'W3C Microwave Parallel',
        href: '/tutorials/examples/microwave-parallel',
        description: 'A parallel-state microwave oven that separates engine and door behavior while keeping the HTML5 panel executable.'
      },
      {
        title: 'W3C Calculator',
        href: '/tutorials/examples/calculator',
        description: 'A calculator statechart with a live keypad for digits, decimal points, operators, and result calculation.'
      },
      {
        title: 'StopWatch',
        href: '/tutorials/examples/stopwatch',
        description: 'A two-button stopwatch with SCXML-driven start, pause, resume, reset, lap, and display update behavior.'
      },
      {
        title: 'Morse Code Trainer',
        href: '/tutorials/examples/morse',
        description: 'An EcmaScript-datamodel Morse keyer that decodes timed dot, dash, short pause, and long pause events.'
      },
      {
        title: 'Dining Philosophers',
        href: '/tutorials/examples/dining-philosophers',
        description: 'A live resource-hierarchy solution where five philosophers acquire numbered forks without deadlocking.'
      }
    ]
  },
  {
    title: 'Pattern examples',
    description: 'Executable SCXML models for software architecture and business-process patterns.',
    examples: [
      {
        title: 'Circuit Breaker Pattern',
        href: '/tutorials/examples/circuit-breaker',
        description: 'A resilience pattern model with closed, open, and half-open states, failure thresholds, cooldown, and probe requests.'
      },
      {
        title: 'Business Process',
        href: '/tutorials/examples/business-process',
        description: 'A BPMN-style order fulfillment process with validation, inventory branching, parallel payment and packing, shipping, completion, and cancellation.'
      }
    ]
  },
  {
    title: 'External example ports',
    description: 'Runnable SCION ports of examples from other state machine and SCXML projects.',
    examples: [
      {
        title: 'Fetch',
        href: '/tutorials/examples/fetch',
        sourcePath: 'Source: Stately XState examples',
        description: 'A SCXML port of Stately&apos;s simple fetch example, with idle, loading, success, failure, retry, cancel, and reset behavior.'
      },
      {
        title: 'Qt FTP Client',
        href: '/tutorials/examples/ftp-client',
        sourcePath: 'Source: Qt SCXML FTP Client example',
        description: 'A browser simulation of Qt&apos;s FTP client state structure, including command sending, reply handling, password request, success, and failure states.'
      },
      {
        title: 'Toggle',
        href: '/tutorials/examples/toggle',
        sourcePath: 'Source: Stately XState Toggle example',
        description: 'A SCXML port of Stately&apos;s two-state toggle example, with active/inactive states and explicit set/reset events.'
      }
    ]
  },
  {
    title: 'Project examples',
    description: 'Example applications and integration projects from the local projects/examples tree.',
    examples: [
      {
        title: 'VanillaJS Light Switch',
        href: '/tutorials/introduction',
        sourcePath: 'projects/examples/vanillajs-light-switch',
        description: 'A plain JavaScript light switch application driven by a small SCXML state machine.'
      },
      {
        title: 'jQuery Drawing Tool',
        sourcePath: 'projects/examples/jquery-drawing-tool',
        description: 'A jQuery/SVG drawing tool example backed by an SCXML interaction model.'
      },
      {
        title: 'Universal Morse Input/Output',
        href: '/tutorials/examples/morse',
        sourcePath: 'projects/examples/universal-morse-input-output',
        description: 'A visual Morse code parser implemented in SCXML, with browser and hardware-oriented input/output.'
      },
      {
        title: 'vi Everywhere',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/vi',
        sourcePath: 'projects/examples/vi',
        description: 'An executable model of vi editor behavior using Statecharts and an SVG-based editing environment.'
      },
      {
        title: 'React Redux Drag and Drop',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/react-redux/drag-and-drop-redux',
        sourcePath: 'projects/examples/react-redux/drag-and-drop-redux/drag-and-drop-redux',
        description: 'A Redux integration example where SCXML drives drag-and-drop behavior.'
      },
      {
        title: 'React Redux Drag and Drop with DevTools',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/react-redux/drag-and-drop-redux/drag-and-drop-redux-with-devtools',
        sourcePath: 'projects/examples/react-redux/drag-and-drop-redux/drag-and-drop-redux-with-devtools',
        description: 'The Redux drag-and-drop example with Redux DevTools and the SCION monitor integration.'
      },
      {
        title: 'BotBuilder First Run',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/botbuilder/examples/basics-firstRun',
        sourcePath: 'projects/examples/botbuilder/examples/basics-firstRun',
        description: 'A Microsoft BotBuilder sample implemented with SCION and SCXML.'
      },
      {
        title: 'BotBuilder Menus',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/botbuilder/examples/basics-menus',
        sourcePath: 'projects/examples/botbuilder/examples/basics-menus',
        description: 'A BotBuilder menu flow implemented with SCION common bot components.'
      },
      {
        title: 'BotBuilder Multi-turn',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/botbuilder/examples/basics-multiTurn',
        sourcePath: 'projects/examples/botbuilder/examples/basics-multiTurn',
        description: 'A multi-turn BotBuilder conversation modeled with SCXML.'
      },
      {
        title: 'BotBuilder Waterfall',
        sourcePath: 'projects/examples/botbuilder/examples/basics-waterfall',
        description: 'A BotBuilder waterfall sample using the shared SCION BotBuilder components.'
      },
      {
        title: 'BotBuilder Hello ChatConnector',
        href: 'https://github.com/jbeard4/scion/tree/main/projects/examples/botbuilder/examples/hello-chatConnector',
        sourcePath: 'projects/examples/botbuilder/examples/hello-chatConnector',
        description: 'A Hello ChatConnector BotBuilder sample powered by SCXML.'
      },
      {
        title: 'Webpack SCXML Bundle',
        sourcePath: 'projects/examples/webpack',
        description: 'A Webpack example showing SCXML bundled into a browser application.'
      },
      {
        title: 'Scharpie Validation Tests',
        sourcePath: 'projects/examples/test-scharpie',
        description: 'A small validation example for linting SCXML with the scharpie ESLint plugin.'
      },
      {
        title: 'SCXML.IO Gatsby Site',
        href: '/',
        sourcePath: 'projects/examples/sciblog',
        description: 'This Gatsby site, including the live SCION, SCHVIZ, and React examples.'
      }
    ]
  }
]

const sectionIds = {
  'Videos': 'videos',
  'Thure tutorials': 'thure-tutorials',
  'Ported SCXML tutorials': 'ported-scxml-tutorials',
  'Pattern examples': 'pattern-examples',
  'External example ports': 'external-example-ports',
  'Project examples': 'project-examples',
}

const sidebarItems = sections.map(section => ({
  label: section.title,
  href: `#${sectionIds[section.title]}`,
  items: section.examples.filter(example => example.href).map(example => ({
    label: example.title,
    href: example.href,
  })),
}))

const Examples = () => (
  <div className="container">
    <h1 style={{ textAlign: 'center', padding: '1em 0' }}>Examples</h1>
    <div className="section-page">
      <SectionSidebar title="Examples" items={sidebarItems} />
      <div className="section-page__content">
        <p>
          Browse runnable SCXML examples powered by SCION. Each example pairs a statechart with an executable
          browser interface so the model can be inspected and exercised directly.
        </p>
        {
          sections.map(section => (
            <section id={sectionIds[section.title]} key={section.title} style={{ marginTop: '2rem' }}>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
              <div className="row">
                {
                  section.examples.map(example => (
                    <div className="col-md-6" key={example.title} style={{ marginBottom: '1.5rem' }}>
                      <h3>
                        {example.href ? <ExampleLink href={example.href}>{example.title}</ExampleLink> : example.title}
                      </h3>
                      <p>{example.description}</p>
                      {example.sourcePath &&
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                          <code>{example.sourcePath}</code>
                        </p>}
                    </div>
                  ))
                }
              </div>
            </section>
          ))
        }
      </div>
    </div>
  </div>
)

export default Examples

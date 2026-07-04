function getLineColumn(source, index) {
  const prefix = source.slice(0, Math.max(index, 0))
  const lines = prefix.split('\n')

  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  }
}

function createMessage(source, index, message, ruleId) {
  const location = getLineColumn(source, index)
  const lineText = source.split('\n')[location.line - 1] || ''

  return {
    ruleId,
    severity: 2,
    message,
    line: location.line,
    column: location.column,
    nodeType: 'XmlFragment',
    source: lineText,
    endLine: location.line,
    endColumn: Math.max(lineText.length, location.column),
  }
}

function findTagIndex(source, id) {
  const re = new RegExp(`<[^>]+\\bid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`)
  const match = source.match(re)

  return match ? match.index : 0
}

function lintSCXML(source) {
  if (typeof window === 'undefined' || !window.DOMParser) return []

  const parser = new window.DOMParser()
  const document = parser.parseFromString(source, 'application/xml')
  const parserError = document.getElementsByTagName('parsererror')[0]

  if (parserError) {
    const text = parserError.textContent || 'XML parser error'
    const lineMatch = text.match(/line\s+(\d+)/i)
    const line = lineMatch ? parseInt(lineMatch[1], 10) : 1
    const lines = source.split('\n')
    const index = lines.slice(0, line - 1).join('\n').length

    return [
      createMessage(
        source,
        index,
        text.split('\n')[0],
        'scharpie/xml-well-formedness'
      ),
    ]
  }

  const root = document.documentElement
  if (!root || root.localName !== 'scxml') {
    return [
      createMessage(
        source,
        0,
        'Document root must be an <scxml> element.',
        'scharpie/scxml-root'
      ),
    ]
  }

  const messages = []
  const states = Array.prototype.slice
    .call(document.querySelectorAll('state, parallel, final'))
    .filter(node => node.getAttribute('id'))
  const stateIds = states.map(node => node.getAttribute('id'))
  const stateIdSet = stateIds.reduce((set, id) => {
    set[id] = true
    return set
  }, {})

  stateIds.forEach((id, index) => {
    if (stateIds.indexOf(id) !== index) {
      messages.push(
        createMessage(
          source,
          findTagIndex(source, id),
          `Duplicate state id "${id}".`,
          'scharpie/duplicate-state-id'
        )
      )
    }
  })

  const initial = root.getAttribute('initial')
  if (initial && !stateIdSet[initial]) {
    messages.push(
      createMessage(
        source,
        source.indexOf(`initial="${initial}"`),
        `Initial state "${initial}" does not exist.`,
        'scharpie/unknown-initial-state'
      )
    )
  }

  Array.prototype.slice.call(document.querySelectorAll('transition[target]')).forEach(node => {
    const targets = node.getAttribute('target').trim().split(/\s+/)

    targets.forEach(target => {
      if (!stateIdSet[target]) {
        messages.push(
          createMessage(
            source,
            source.indexOf(`target="${node.getAttribute('target')}"`),
            `Transition target "${target}" does not exist.`,
            'scharpie/unknown-transition-target'
          )
        )
      }
    })
  })

  return messages
}

function validateSCXML(source) {
  const messages = lintSCXML(source)

  return {
    errors: messages.length ? messages.map(message => message.message) : null,
  }
}

module.exports = {
  lintSCXML,
  validateSCXML,
}

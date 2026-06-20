let schviz

if (typeof document === 'undefined') {
  const React = require('react')

  schviz = function SchvizPlaceholder() {
    return React.createElement('div', null)
  }

  schviz.layouts = {
    auto: {},
    layer: {},
    right: {}
  }
} else {
  const scxml = require('./scxml')

  window.scion = window.scion || {}
  window.scion.scxml = window.scion.scxml || scxml

  const schvizModule = require('../../../../libraries/schviz/dist/schviz.js')
  schviz = schvizModule && schvizModule.default ? schvizModule.default : schvizModule
}

module.exports = schviz
module.exports.default = schviz

const concatenify = require('concatenify');

window.addEventListener('DOMContentLoaded', () => {
  window['$'] = window['jQuery'] = require("jquery")
  concatenify("../node_modules/jquery-ui-dist/jquery-ui.js")
  concatenify("../node_modules/ui-contextmenu/jquery.ui-contextmenu.js")

  require('../index.css')
  require('../node_modules/jquery-ui-dist/jquery-ui.css')
  require('../node_modules/toastr/build/toastr.css')

  require('./main')
})

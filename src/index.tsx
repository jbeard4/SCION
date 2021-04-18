const concatenify = require('concatenify');

window['$'] = window['jQuery'] = require("jquery")
concatenify("../node_modules/jquery-ui-dist/jquery-ui.js")
concatenify("../node_modules/ui-contextmenu/jquery.ui-contextmenu.js")
concatenify("../node_modules/react-ui-layout/jquery.layout-latest.js")
concatenify("../node_modules/slickgrid/lib/jquery.event.drag-2.3.0.js")
concatenify("../node_modules/slickgrid/slick.core.js")
concatenify("../node_modules/slickgrid/slick.grid.js")
concatenify("../node_modules/slickgrid/slick.dataview.js")
concatenify("../node_modules/slickgrid/plugins/slick.rowselectionmodel.js")

require('./main')

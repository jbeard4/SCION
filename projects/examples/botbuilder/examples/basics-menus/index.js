const path = require('path');
const scxmlBotbuilder = require('@scion-scxml/botbuilder-common');

scxmlBotbuilder.init(path.join(__dirname,'src'),'app.scxml');

const path = require('path');
const scxmlBotbuilder = require('scion-scxml-botbuilder-common');

scxmlBotbuilder.init(path.join(__dirname,'src'),'app.scxml',
{
  recognizer : {
    type : 'luis',
    model : 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8b23229c-0873-4790-bbc7-7f05498f20e5?subscription-key=e08491d026124f7d9ddbaa118bcb8220&verbose=true&timezoneOffset=0&q='
  }
});

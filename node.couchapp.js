 var couchapp = require('couchapp')
    , path = require('path')
    , description = require('./package.json').description;

  ddoc = {
      _id: 'morse',
      type: 'project.example',
      description 
  }

  module.exports = ddoc;

  couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

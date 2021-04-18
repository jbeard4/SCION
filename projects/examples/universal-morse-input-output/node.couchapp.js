 var couchapp = require('couchapp')
    , pkg = require('./package.json')
    , path = require('path')
    , _id = pkg.name.split('/').pop()
    , description = pkg.description;

  ddoc = {
      _id,
      type: 'project.example',
      description 
  }

  module.exports = ddoc;

  couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

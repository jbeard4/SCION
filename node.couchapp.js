 var couchapp = require('couchapp')
    , path = require('path');

  ddoc = {
      _id: 'morse'
  }

  module.exports = ddoc;

  couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

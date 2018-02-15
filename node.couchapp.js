 var couchapp = require('couchapp')
    , path = require('path');

  ddoc = {
      _id: 'morse'
    , views: {}
    , lists: {}
    , shows: {} 
  }

  module.exports = ddoc;

  couchapp.loadAttachments(ddoc, path.join(__dirname, '_attachments'));

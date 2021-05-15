var couchapp = require('couchapp')
  , path = require('path')
  , pkg = require('./package.json')
  , description = pkg.description
  , _id = pkg.name.split('/').pop();

ddoc = {
    _id,
    type: 'project.example',
    description 
}

module.exports = ddoc;

couchapp.loadAttachments(ddoc, path.join(__dirname,'app'));

const xmllint = require('xmllint');
const path = require('path');
const fs = require('fs');

const scxmlFileName = process.argv[2];
const pathToSchema = path.join(__dirname,'scxml.xsd');
const schema = fs.readFileSync(pathToSchema); 
const xml = fs.readFileSync(scxmlFileName);


const scxmlSchemaFileNames = [
  'scxml-attribs.xsd',
  'scxml-contentmodels.xsd',
  'scxml-copyright.xsd',
  'scxml-core-strict.xsd',
  'scxml-data-strict.xsd',
  'scxml-datatypes.xsd',
  'scxml-external-strict.xsd',
  'scxml-message.xsd',
  'scxml-messages.xsd',
  'scxml-module-anchor.xsd',
  'scxml-module-core.xsd',
  'scxml-module-data.xsd',
  'scxml-module-external.xsd',
  'scxml-module-script.xsd',
  'scxml-profile-basic.xsd',
  'scxml-profile-ecma.xsd',
  'scxml-profile-minimum.xsd',
  'scxml-profile-xpath.xsd',
  'scxml-strict.xsd',
  'scxml.xsd'
];

const o = xmllint.validateXML({
  xml : xml,
  schema : schema 
  //arguments: ['--xinclude', '--noout', '--schema', pathToSchema, scxmlFileName]
});

console.log('o',o);

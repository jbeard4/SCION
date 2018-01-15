const xmllint = require('xmllint');
const path = require('path');
const fs = require('fs');

const scxmlFileName = process.argv[2];
const xml = fs.readFileSync(scxmlFileName ,'utf8');

const scxmlSchemaFileNames = [
  'xml.xsd',
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


const schemas = scxmlSchemaFileNames.map( name => {
  let s = fs.readFileSync(path.join(__dirname, 'xsd', name),'utf8');

  scxmlSchemaFileNames.forEach( (schemaName,i) => {
    let stringToReplace = 
      schemaName === 'xml.xsd' ? 
      'http://www.w3.org/2001/xml.xsd' : 
      schemaName;
    s = s.replace(stringToReplace, `file_${i}.xsd`)
  }); 
  return {
    name : name,
    schema : s
  };
}); 

const o = xmllint.validateXML({
  xml : xml,
  schema : schemas.map( s => s.schema )
  //arguments: ['--xinclude', '--noout', '--schema', pathToSchema, scxmlFileName]
});

console.log('errors',o.errors);

#!/usr/bin/env node

const xmllint = require('@scion-scxml/xmllint');
const path = require('path');
const fs = require('fs');

const schemas = [
  {
    name : 'xml.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','xml.xsd'),'utf8')
  },
  {
    name : 'scxml-attribs.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-attribs.xsd'),'utf8')
  },
  {
    name : 'scxml-contentmodels.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-contentmodels.xsd'),'utf8')
  },
  {
    name : 'scxml-copyright.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-copyright.xsd'),'utf8')
  },
  {
    name : 'scxml-core-strict.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-core-strict.xsd'),'utf8')
  },
  {
    name : 'scxml-data-strict.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-data-strict.xsd'),'utf8')
  },
  {
    name : 'scxml-datatypes.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-datatypes.xsd'),'utf8')
  },
  {
    name : 'scxml-external-strict.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-external-strict.xsd'),'utf8')
  },
  {
    name : 'scxml-message.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-message.xsd'),'utf8')
  },
  {
    name : 'scxml-messages.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-messages.xsd'),'utf8')
  },
  {
    name : 'scxml-module-anchor.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-module-anchor.xsd'),'utf8')
  },
  {
    name : 'scxml-module-core.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-module-core.xsd'),'utf8')
  },
  {
    name : 'scxml-module-data.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-module-data.xsd'),'utf8')
  },
  {
    name : 'scxml-module-external.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-module-external.xsd'),'utf8')
  },
  {
    name : 'scxml-module-script.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-module-script.xsd'),'utf8')
  },
  {
    name : 'scxml-profile-basic.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-profile-basic.xsd'),'utf8')
  },
  {
    name : 'scxml-profile-ecma.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-profile-ecma.xsd'),'utf8')
  },
  {
    name : 'scxml-profile-minimum.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-profile-minimum.xsd'),'utf8')
  },
  {
    name : 'scxml-profile-xpath.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-profile-xpath.xsd'),'utf8')
  },
  {
    name : 'scxml-strict.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml-strict.xsd'),'utf8')
  },
  {
    name : 'scxml.xsd' , 
    schema : fs.readFileSync(path.join(__dirname, 'xsd','scxml.xsd'),'utf8')
  }
];

schemas.forEach( schemaObj => {
  let schemaStr = schemaObj.schema;
  schemas.forEach( (schemaObj2,i) => {
    schemaName = schemaObj2.name;
    let stringToReplace = 
      schemaName === 'xml.xsd' ? 
      'http://www.w3.org/2001/xml.xsd' : 
      schemaName;
    schemaStr = schemaStr.replace(stringToReplace, `file_${i}.xsd`)
  }); 
  schemaObj.schema = schemaStr; 
}); 


module.exports.validateSCXML = function(xml){
  return xmllint.validateXML({
    xml : xml,
    schema : schemas.map( s => s.schema )
    //arguments: ['--xinclude', '--noout', '--schema', pathToSchema, scxmlFileName]
  });
};

if(require.main === module){
  const scxmlFileName = process.argv[2];
  const xml = fs.readFileSync(scxmlFileName ,'utf8');
  const o = module.exports.validateSCXML(xml);
  console.log(o);
  process.exit(o.errors === null ? 0 : o.errors.length);
}

function JSDOM(xmlString, options){
    let domParser = new DOMParser();
    let dom = domParser.parseFromString(xmlString, options.contentType);
    return {window : { document : dom } };
}

module.exports.JSDOM = JSDOM;

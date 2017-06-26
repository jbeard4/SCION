const urlM = require('url'),
      path = require('path');

/**
 * Resolver algorithm:
 *
 * doc loaded from url over http (http protocol)
 *  	invoke/@src has http protocol: different domain. different path.
 *  	invoke/@src has absolute file protocol: same domain. change the path. 
 *  	invoke/@src has relative file protocol: same domain. resolve relative to the path.

 * doc loaded from filesystem path (file protocol)
 *  	invoke/@src has http protocol: fine. load the session over http.
 *  	invoke/@src has absolute file protocol: fine. load file from filesystem. absolute path.
 *  	invoke/@src has relative file protocol: fine.  load file from filesystem. resolve relative path
 */
function resolveUri(relativeToUrl, resourceUrl){
    const resourceUrlObj = urlM.parse(resourceUrl),
        relativeToUrlObj = urlM.parse(relativeToUrl);

    switch(relativeToUrlObj.protocol){
      // doc loaded from url over http (http protocol)
      case 'http:':
      case 'https:':
        switch(resourceUrlObj.protocol){
          case 'http:':
          case 'https:':
            // invoke/@src has http protocol: different domain. different path.
            return resourceUrl;
            break;
          case 'file:':
          default:
            if(path.isAbsolute(resourceUrlObj.pathname)){
              // invoke/@src has absolute file protocol: same domain. change the path. 
              relativeToUrlObj.pathname = resourceUrlObj.pathname;
              return urlM.format(relativeToUrlObj);
            } else {
              // invoke/@src has relative file protocol: same domain. resolve relative to the path.
              // resolve relative path
              return convertRelativePath(relativeToUrlObj, resourceUrlObj)
            }
            break;
        } 
        break;
      // doc loaded from filesystem path (file protocol)
      case 'file:':
      default:
        switch(resourceUrlObj.protocol){
          case 'http:':
          case 'https:':
            //	invoke/@src has http protocol: fine. load the session over http.
            return resourceUrl;
            break;
          case 'file:':
          default:
            if(path.isAbsolute(resourceUrlObj.pathname)){
              //	invoke/@src has absolute file protocol: fine. load file from filesystem. absolute path.
              relativeToUrlObj.protocol = 'file:';
              relativeToUrlObj.pathname = resourceUrlObj.pathname;
              return urlM.format(relativeToUrlObj);
            } else {
              //	invoke/@src has relative file protocol: fine.  load file from filesystem. resolve relative path
              let newPath = path.join(path.dirname(relativeToUrlObj.pathname), resourceUrlObj.pathname);
              relativeToUrlObj.protocol = 'file:';
              return convertRelativePath(relativeToUrlObj, resourceUrlObj)
            }
            break;
        } 
        break;
    } 
}

function convertRelativePath(relativeToUrlObj, resourceUrlObj){
  let newPath;
  if(path.extname(relativeToUrlObj.pathname)){
    //assume he is a file
    newPath = path.join(path.dirname(relativeToUrlObj.pathname), resourceUrlObj.pathname);
  }else{
    //assume he is a directory
    newPath = path.join(relativeToUrlObj.pathname, resourceUrlObj.pathname);
  }
  relativeToUrlObj.pathname = newPath;
  return urlM.format(relativeToUrlObj);
}

//console.log(resolveUri('http://foo.com/bar','bat.scxml'));
//console.log(resolveUri('http://foo.com/bar/bat.scxml','bif.scxml'));
//console.log(resolveUri('http://foo.com/bar/bat.scxml','bif.js'));
//console.log(resolveUri('file:/foo/bar/','bat.scxml'));
//console.log(resolveUri('file:/foo/bar/bat.scxml','bif.js'));
//console.log(resolveUri('file:/foo/bar/bat.scxml','bif.scxml'));

module.exports = resolveUri;

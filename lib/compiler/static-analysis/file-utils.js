var pm = require('../../runtime/platform-bootstrap/platform');

var fileUtils = {
    read: function (filePath, docUrl, context, cb) {
        var result = {
            error: null,
            content: ''
        };

        if(docUrl) {
            filePath = pm.platform.url.resolve(docUrl, filePath);
        }

        pm.platform.getResourceFromUrl(filePath,function(err,text,mimeType){
            if(err){
                result.error = "Error downloading document \"" + filePath + "\", " + (err.message || err);
                //TODO kill the process if file is not present
            }else{
                result.content = text;
            }
            
            cb(result);

        }, context);
    }
};

module.exports = fileUtils;
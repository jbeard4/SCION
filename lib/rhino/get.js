/**
 * This contains some functions for getting stuff in Rhino.
 */

function httpGet(url){
    var urlObject = new Packages.java.net.URL(url);
    var conn = urlObject.openConnection();
    conn.setRequestMethod("GET");
    var rd = new Packages.java.io.BufferedReader(
                new Packages.java.io.InputStreamReader(
                    conn.getInputStream()));
    var line;
    var result = "";
    /*jsl:ignore*/
    while (line = rd.readLine()) {
    /*jsl:end*/
        result += line;
    }
    rd.close();
    return result;
}

//TODO
function httpPost(url,data,cb){
}

function readFile(file){
    var br = new Packages.java.io.BufferedReader(
                new Packages.java.io.InputStreamReader(
                new Packages.java.io.DataInputStream(
                new Packages.java.io.FileInputStream(file))));
    var result = "";
    var strLine;
    /*jsl:ignore*/
    while (strLine = br.readLine()){
    /*jsl:end*/
        result += strLine;
    }
    br.close();
    return result;
}

function getResource(url,cb){
    try {
        if(url.match(/^http(s?):/)){
            var result = httpGet(url);
            cb(null,result);
        }else{
            //assume filesystem
            result = readFile(url);
            cb(null,result);
        }
    }catch(e){
        cb(e);
    }
}

module.exports = {
    httpGet : httpGet,
    httpPost : httpPost,
    readFile : readFile,
    getResource : getResource
};

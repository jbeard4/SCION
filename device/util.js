function fetchPage(url,cb){
  if(validUrl.isUri(url)){
    http.get(url,function(res){
      var pageContents = '';
      res.on('data',function(s){
        pageContents += s;
      });

      res.on('end',function(){
        try {
          var text = extractTextContentFromPage(pageContents);
        } catch(e){
          return cb(e); 
        }
        cb(null, text);
      });
    }).on('error',function(err){
      cb(err);
    });
  }
}

function extractTextContentFromPage(pageContents){
  var $ = cheerio.load(pageContents);
  //assume some semantic markup
  return $('body').text();
}

module.exports.fetchPage = fetchPage;

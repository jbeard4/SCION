var validUrl = require('valid-url');
var http = require('http');
var cheerio = require('cheerio');

function fetchPage(url,cb){
  url = 'http://' + url;    //add URI prefix

  console.log('fetching page',url);
  http.get(url,function(res){
    var pageContents = '';
    res.on('data',function(s){
      pageContents += s;
    });

    res.on('end',function(){
      try {
        var text = extractTextContentFromPage(pageContents);
        console.log('text',text);
      } catch(e){
        return cb(e); 
      }
      cb(null, text);
    });
  }).on('error',function(err){
    cb(err);
  });
}

function extractTextContentFromPage(pageContents){
  var $ = cheerio.load(pageContents);
  //assume some semantic markup
  return $('article .body').text();
}

module.exports.fetchPage = fetchPage;

if(require.main === module){
  fetchPage('http://slashdot.org/',function(err, pageContents){
    console.log('pageContents',err, pageContents);
  });
}

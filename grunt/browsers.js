var _ = require('underscore');

var browsers = [];

function addBrowser(browserName, platform, version){
  browsers.push({
    browserName : browserName,
    platform : platform,
    version : version 
  });
}

var defaultFF = [5, 10, 20, 30, 40, 46, //'dev', 
                    'beta'],
    defaultChrome = [26, 36, 51, 'dev', 'beta'];

addBrowser('internet explorer', 'Windows 10', 11);
addBrowser('MicrosoftEdge', 'Windows 10', '13.10586');
defaultChrome.forEach(addBrowser.bind(this, 'chrome', 'Windows 10'));
_.difference(defaultFF,[46, 'dev']) //these fail on sauce labs due to sauce labs bugs
  .forEach(addBrowser.bind(this, 'firefox', 'Windows 10'));

[8, 9, 10, 11].forEach(addBrowser.bind(this, 'internet explorer', 'Windows 7'));
_.difference(defaultChrome,[36])    //TODO: fix Chrome 36 on Windows 7, which consistently fails for unknown reason
  .forEach(addBrowser.bind(this, 'chrome', 'Windows 7'));
[11, 12].forEach(addBrowser.bind(this, 'opera', 'Windows 7'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'Windows 7'));
addBrowser('safari', 'Windows 7', 5);


addBrowser('internet explorer', 'Windows XP', 8);
[26, 36, 49].forEach(addBrowser.bind(this, 'chrome', 'Windows XP'));
[
  //11,   //TODO: opera 11 on Windows XP always timing out. probable sauce labs platform bug
  12].forEach(addBrowser.bind(this, 'opera', 'Windows XP'));
[ 4, 10, 20, 30, 40, 45 ].forEach(addBrowser.bind(this, 'firefox', 'Windows XP'));

_.difference(defaultChrome,[26])  //chrome 26 not supported on OS X 10.11
  .forEach(addBrowser.bind(this, 'chrome', 'OS X 10.11'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'OS X 10.11'));
addBrowser('safari', 'OS X 10.11', 9);

_.difference(defaultChrome,[26,36]) //chrome 36 and 26 not supported on OS X 10.10
  .forEach(addBrowser.bind(this, 'chrome', 'OS X 10.10'));
[32, 
  //42,     //FIXME: Firefox 42 times out
  44].forEach(addBrowser.bind(this, 'firefox', 'OS X 10.10'));
addBrowser('safari', 'OS X 10.10', 8);

_.difference(defaultChrome,[26])
 .forEach(addBrowser.bind(this, 'chrome', 'OS X 10.9'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'OS X 10.9'));
addBrowser('safari', 'OS X 10.9', 7);

[27, 
  //30, //Chrome 30 not supported
  40, 49].forEach(addBrowser.bind(this, 'chrome', 'OS X 10.8'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'OS X 10.8'));
addBrowser('safari', 'OS X 10.8', 6);

[26, 30, 40, 48].forEach(addBrowser.bind(this, 'chrome', 'Linux'));
[4, 10, 20, 30, 40, 45].forEach(addBrowser.bind(this, 'firefox', 'Linux'));
addBrowser('opera', 'Linux', 12);

module.exports = browsers;

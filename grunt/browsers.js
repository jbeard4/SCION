var _ = require('underscore');

var browsers = [];

function addBrowser(browserName, platform, version){
  browsers.push({
    browserName : browserName,
    platform : platform,
    version : version 
  });
}

addBrowser('internet explorer', 'Windows 10', 11);
addBrowser('MicrosoftEdge', 'Windows 10', '13.10586');
_.range(26, 51 + 1).forEach(addBrowser.bind(this, 'chrome', 'Windows 10'));
_.range(4, 46 + 1).forEach(addBrowser.bind(this, 'firefox', 'Windows 10'));

_.range(8, 11 + 1).forEach(addBrowser.bind(this, 'internet explorer', 'Windows 7'));
_.range(26, 51 + 1).forEach(addBrowser.bind(this, 'chrome', 'Windows 7'));
_.range(11, 12 + 1).forEach(addBrowser.bind(this, 'opera', 'Windows 7'));
_.range(4, 46 + 1).forEach(addBrowser.bind(this, 'firefox', 'Windows 7'));
addBrowser('safari', 'Windows 7', 5);

addBrowser('internet explorer', 'Windows XP', 8);
_.range(26, 49 + 1).forEach(addBrowser.bind(this, 'chrome', 'Windows XP'));
_.range(11, 12 + 1).forEach(addBrowser.bind(this, 'opera', 'Windows XP'));
_.range(4, 45 + 1).forEach(addBrowser.bind(this, 'firefox', 'Windows XP'));

_.range(26, 51 + 1).forEach(addBrowser.bind(this, 'chrome', 'OS X 10.11'));
_.range(4, 46 + 1).forEach(addBrowser.bind(this, 'firefox', 'OS X 10.11'));
addBrowser('safari', 'OS X 10.11', 9);

_.range(37, 51 + 1).forEach(addBrowser.bind(this, 'chrome', 'OS X 10.10'));
_.range(32, 44 + 1).forEach(addBrowser.bind(this, 'firefox', 'OS X 10.10'));
addBrowser('safari', 'OS X 10.10', 8);

_.range(31, 51 + 1).forEach(addBrowser.bind(this, 'chrome', 'OS X 10.9'));
_.range(4, 46 + 1).forEach(addBrowser.bind(this, 'firefox', 'OS X 10.9'));
addBrowser('safari', 'OS X 10.9', 7);

_.range(27, 49 + 1).forEach(addBrowser.bind(this, 'chrome', 'OS X 10.8'));
_.range(4, 46 + 1).forEach(addBrowser.bind(this, 'firefox', 'OS X 10.8'));
addBrowser('safari', 'OS X 10.8', 6);

_.range(26, 48 + 1).forEach(addBrowser.bind(this, 'chrome', 'Linux'));
_.range(4, 45 + 1).forEach(addBrowser.bind(this, 'firefox', 'Linux'));
addBrowser('opera', 'Linux', 12);

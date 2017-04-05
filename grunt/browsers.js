var _ = require('underscore');

var browsers = [];

function addBrowser(browserName, platform, version){
  browsers.push({
    browserName : browserName,
    platform : platform,
    version : version 
  });
}

var defaultFF = [5, 47],
    defaultChrome = [26, 51, 'beta'];

addBrowser('internet explorer', 'Windows 10', 11);
addBrowser('MicrosoftEdge', 'Windows 10', '13.10586');
defaultChrome.forEach(addBrowser.bind(this, 'chrome', 'Windows 10'));
_.difference(defaultFF,[47]) //these fail on sauce labs due to sauce labs bugs
  .forEach(addBrowser.bind(this, 'firefox', 'Windows 10'));

[8, 9, 10, 11].forEach(addBrowser.bind(this, 'internet explorer', 'Windows 7'));
[11, 12].forEach(addBrowser.bind(this, 'opera', 'Windows 7'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'Windows 7'));


addBrowser('internet explorer', 'Windows XP', 8);
[26, 49].forEach(addBrowser.bind(this, 'chrome', 'Windows XP'));
[12].forEach(addBrowser.bind(this, 'opera', 'Windows XP'));
[ 4, 45 ].forEach(addBrowser.bind(this, 'firefox', 'Windows XP'));

[51].forEach(addBrowser.bind(this, 'chrome', 'OS X 10.11'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'OS X 10.11'));
addBrowser('safari', 'OS X 10.11', 9);

[51].forEach(addBrowser.bind(this, 'chrome', 'OS X 10.10'));
[32, 44].forEach(addBrowser.bind(this, 'firefox', 'OS X 10.10'));
addBrowser('safari', 'OS X 10.10', 8);

_.difference(defaultChrome,[26])
 .forEach(addBrowser.bind(this, 'chrome', 'OS X 10.9'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'OS X 10.9'));
addBrowser('safari', 'OS X 10.9', 7);

[27, 49].forEach(addBrowser.bind(this, 'chrome', 'OS X 10.8'));
defaultFF.forEach(addBrowser.bind(this, 'firefox', 'OS X 10.8'));
addBrowser('safari', 'OS X 10.8', 6);

[26, 48].forEach(addBrowser.bind(this, 'chrome', 'Linux'));
[4, 45].forEach(addBrowser.bind(this, 'firefox', 'Linux'));
addBrowser('opera', 'Linux', 12);

['9.4','8.4'].forEach(function(version){
  browsers.push({
    "appiumVersion": "1.5.3",
    "deviceName": "iPhone 6 Simulator",
    "deviceOrientation": "portrait",
    "platformVersion": version,
    "platformName": "iOS",
    "browserName": "Safari"
  });
});

/*
['5.1','5.0','4.4','4.3','4.2'].forEach(function(version){
  browsers.push({
    "appiumVersion": "1.5.3",
    "deviceName":"Android Emulator",
    "deviceType":"phone",
    "deviceOrientation": "portrait",
    "browserName": "Browser",
    "platformVersion": version,
    "platformName":"Android"
  });
});
*/

module.exports = browsers;
